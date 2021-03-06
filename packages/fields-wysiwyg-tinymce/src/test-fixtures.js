import { getItems } from '@keystonejs/server-side-graphql-client';
import { Text } from '@keystonejs/fields';

import { Wysiwyg } from './';

export const name = 'Wysiwyg';
export { Wysiwyg as type };
export const exampleValue = 'foo';
export const exampleValue2 = '<p><strong>This is BOLD</strong></p>';
export const supportsUnique = true;
export const fieldName = 'content';

export const getTestFields = () => {
  return {
    name: { type: Text },
    content: { type: Wysiwyg },
  };
};

const contentA = '<p><strong>This is bold</strong></p>';
const contentB =
  '<p>This is <a href="www.test.com">link</a> and <em>italics, </em><span style="text-decoration: underline;">an underline </span>with <span style="text-decoration: line-through;">Strikethrough</span><em>.&nbsp;</em></p>';
const contentC = '<p><span style="text-decoration: line-through;">Strikethrough</span></p>';
const contentD = '<p><strong>This is BOLD</strong></p>';

export const initItems = () => {
  return [
    {
      name: 'a',
      content: contentA,
    },
    {
      name: 'b',
      content: contentB,
    },
    {
      name: 'c',
      content: contentC,
    },
    { name: 'd', content: contentD },
    { name: 'e', content: null },
    { name: 'f' },
  ];
};

export const filterTests = withKeystone => {
  const match = async (keystone, where, expected, sortBy = 'name_ASC') =>
    expect(
      await getItems({
        keystone,
        listKey: 'Test',
        where,
        returnFields: 'name content',
        sortBy,
      })
    ).toEqual(expected);

  test(
    'No filter',
    withKeystone(({ keystone }) =>
      match(keystone, undefined, [
        {
          name: 'a',
          content: contentA,
        },
        {
          name: 'b',
          content: contentB,
        },
        {
          name: 'c',
          content: contentC,
        },
        { name: 'd', content: contentD },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );

  test(
    'Empty filter',
    withKeystone(({ keystone }) =>
      match(keystone, {}, [
        {
          name: 'a',
          content: contentA,
        },
        {
          name: 'b',
          content: contentB,
        },
        {
          name: 'c',
          content: contentC,
        },
        { name: 'd', content: contentD },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );

  test(
    'Filter: content (case-sensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content: contentA }, [{ name: 'a', content: contentA }])
    )
  );

  test(
    'Filter: content (case-insensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_i: contentA }, [
        { name: 'a', content: contentA },
        { name: 'd', content: contentD },
      ])
    )
  );

  test(
    'Filter: content_not (case-sensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not: contentA }, [
        { name: 'b', content: contentB },
        { name: 'c', content: contentC },
        { name: 'd', content: contentD },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );

  test(
    'Filter: content_not_i (case-insensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not_i: contentA }, [
        { name: 'b', content: contentB },
        { name: 'c', content: contentC },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );
  test(
    'Filter: content_not null',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not: null }, [
        { name: 'a', content: contentA },
        { name: 'b', content: contentB },
        { name: 'c', content: contentC },
        { name: 'd', content: contentD },
      ])
    )
  );

  test(
    'Filter: content_in (case-sensitive, empty list)',
    withKeystone(({ keystone }) => match(keystone, { content_in: [] }, []))
  );

  test(
    'Filter: content_not_in (empty list)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not_in: [] }, [
        {
          name: 'a',
          content: contentA,
        },
        {
          name: 'b',
          content: contentB,
        },
        {
          name: 'c',
          content: contentC,
        },
        { name: 'd', content: contentD },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );

  test(
    'Filter: content_in',
    withKeystone(({ keystone }) =>
      match(
        keystone,
        {
          content_in: [contentA, contentB],
        },
        [
          { name: 'a', content: contentA },
          { name: 'b', content: contentB },
        ]
      )
    )
  );

  test(
    'Filter: content_not_in',
    withKeystone(({ keystone }) =>
      match(
        keystone,
        {
          content_not_in: [null, contentA, contentB],
        },
        [
          { name: 'c', content: contentC },
          { name: 'd', content: contentD },
        ]
      )
    )
  );

  test(
    'Filter: content_in null',
    withKeystone(({ keystone }) =>
      match(keystone, { content_in: [null] }, [
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );

  test(
    'Filter: content_not_in null',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not_in: [null] }, [
        {
          name: 'a',
          content: contentA,
        },
        {
          name: 'b',
          content: contentB,
        },
        {
          name: 'c',
          content: contentC,
        },
        { name: 'd', content: contentD },
      ])
    )
  );

  test(
    'Filter: content_contains (case-sensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_contains: 'bold' }, [{ name: 'a', content: contentA }])
    )
  );
  test(
    'Filter: content_contains_i (case-insensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_contains_i: 'bold' }, [
        { name: 'a', content: contentA },
        { name: 'd', content: contentD },
      ])
    )
  );

  test(
    'Filter: content_not_contains (case-sensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not_contains: 'bold' }, [
        {
          name: 'b',
          content: contentB,
        },
        {
          name: 'c',
          content: contentC,
        },
        { name: 'd', content: contentD },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );

  test(
    'Filter: content_not_contains_i (case-insensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not_contains_i: 'bold' }, [
        {
          name: 'b',
          content: contentB,
        },
        {
          name: 'c',
          content: contentC,
        },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );

  test(
    'Filter: content_starts_with (case-sensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_starts_with: '<p><strong>This is bold' }, [
        { name: 'a', content: contentA },
      ])
    )
  );

  test(
    'Filter: content_starts_with_i (case-insensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_starts_with_i: '<p><strong>This is bold' }, [
        { name: 'a', content: contentA },
        { name: 'd', content: contentD },
      ])
    )
  );

  test(
    'Filter: content_not_starts_with (case-sensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not_starts_with: '<p><strong>This is bold' }, [
        { name: 'b', content: contentB },
        { name: 'c', content: contentC },
        { name: 'd', content: contentD },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );
  test(
    'Filter: content_not_starts_with_i (case-insensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not_starts_with_i: '<p><strong>This is bold' }, [
        { name: 'b', content: contentB },
        { name: 'c', content: contentC },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );

  test(
    'Filter: content_ends_with (case-sensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_ends_with: 'bold</strong></p>' }, [
        { name: 'a', content: contentA },
      ])
    )
  );

  test(
    'Filter: content_ends_with_i (case-insensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_ends_with_i: 'bold</strong></p>' }, [
        { name: 'a', content: contentA },
        { name: 'd', content: contentD },
      ])
    )
  );
  test(
    'Filter: content_not_ends_with (case-sensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not_ends_with: 'bold</strong></p>' }, [
        { name: 'b', content: contentB },
        { name: 'c', content: contentC },
        { name: 'd', content: contentD },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );

  test(
    'Filter: content_not_ends_with_i (case-insensitive)',
    withKeystone(({ keystone }) =>
      match(keystone, { content_not_ends_with_i: 'bold</strong></p>' }, [
        { name: 'b', content: contentB },
        { name: 'c', content: contentC },
        { name: 'e', content: null },
        { name: 'f', content: null },
      ])
    )
  );
};
