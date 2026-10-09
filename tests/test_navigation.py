"""Static navigation contracts; run with python3 -m unittest discover -s tests -v."""

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import unittest
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    VOID = set('area base br col embed hr img input link meta param source track wbr'.split())

    def __init__(self, html):
        super().__init__()
        self.stack = []
        self.elements = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        element = (tag, dict(attrs))
        self.elements.append((element, tuple(self.stack)))
        if tag not in self.VOID:
            self.stack.append(element)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break


class NavigationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = Page((ROOT / 'index.html').read_text(encoding='utf-8'))

    def test_top_menu_links_resolve_in_main(self):
        headers = [e for e, _ in self.page.elements if e[1].get('id') == 'siteHeader']
        self.assertEqual(len(headers), 1, 'Expected one site header')
        links = [e[1] for e, parents in self.page.elements
                 if e[0] == 'a' and headers[0] in parents]
        self.assertTrue(links, 'The top menu must contain links')
        primary = [e for e, parents in self.page.elements if e[0] == 'a'
                   and any(t == 'nav' and a.get('aria-label') == 'Primary' for t, a in parents)]
        self.assertTrue(primary, 'Primary navigation must not be empty')
        targets = Counter(e[1]['id'] for e, parents in self.page.elements
                          if 'id' in e[1] and (e[0] == 'main' or any(t == 'main' for t, _ in parents)))
        for link in links:
            href = link.get('href', '')
            with self.subTest(href=href):
                self.assertTrue(href.startswith('#') and len(href) > 1,
                                'Every header link must name a destination on this page')
                self.assertEqual(targets[unquote(href[1:])], 1,
                                 f'{href} must resolve to exactly one target in main')

    def test_remaining_sections_follow_hero_without_redundant_sections(self):
        sections = [attrs['id'] for (tag, attrs), parents in self.page.elements
                    if tag == 'section' and 'id' in attrs
                    and any(t == 'main' for t, _ in parents)]
        self.assertEqual(sections, ['hero', 'work', 'clients', 'gray-papers', 'method', 'diagnose'])

    def test_ids_are_unique(self):
        ids = Counter(e[1]['id'] for e, _ in self.page.elements if 'id' in e[1])
        self.assertEqual([key for key, count in ids.items() if count > 1], [])

    def test_all_fragment_links_resolve(self):
        ids = {e[1].get('id') for e, _ in self.page.elements}
        for (tag, attrs), _ in self.page.elements:
            href = attrs.get('href', '')
            if tag == 'a' and href.startswith('#'):
                with self.subTest(href=href):
                    self.assertIn(unquote(href[1:]), ids)

    def test_local_site_assets_exist(self):
        for (tag, attrs), _ in self.page.elements:
            path = attrs.get('src') if tag == 'script' else (
                attrs.get('href') if tag == 'link' and attrs.get('rel') == 'stylesheet' else None)
            if path and not path.startswith(('https://', 'http://', 'data:', '//')):
                with self.subTest(path=path):
                    self.assertFalse(path.startswith('/'), 'Assets must work under /doubleclicc/')
                    self.assertTrue((ROOT / path).is_file(), f'Missing asset: {path}')


if __name__ == '__main__':
    unittest.main()
