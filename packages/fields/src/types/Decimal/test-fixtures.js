import { getItems } from '@keystonejs/server-side-graphql-client';
import Text from '../Text';
import Decimal from './';

export const name = 'Decimal';
export { Decimal as type };
export const exampleValue = '6.28';
export const exampleValue2 = '6.45';
export const supportsUnique = true;
export const fieldName = 'price';

export const getTestFields = () => {
  return {
    name: { type: Text },
    price: { type: Decimal, knexOptions: { scale: 2 } },
  };
};

export const initItems = () => {
  return [
    { name: 'price1', price: '50.00' },
    { name: 'price2', price: '0.01' },
    { name: 'price3', price: '2000.00' },
    { name: 'price4', price: '40000.00' },
    { name: 'price5', price: null },
  ];
};

export const filterTests = withKeystone => {
  const match = async (keystone, where, expected) =>
    expect(
      await getItems({
        keystone,
        listKey: 'Test',
        where,
        returnFields: 'name price',
        sortBy: 'name_ASC',
      })
    ).toEqual(expected);

  test.skip(
    'No filter',
    withKeystone(({ keystone }) =>
      match(keystone, undefined, [
        { name: 'price1', price: '50.00' },
        { name: 'price2', price: '0.01' },
        { name: 'price3', price: '2000.00' },
        { name: 'price4', price: '40000.00' },
        { name: 'price5', price: null },
      ])
    )
  );

  test.skip(
    'Empty filter',
    withKeystone(({ keystone }) =>
      match(keystone, {}, [
        { name: 'price1', price: '50.00' },
        { name: 'price2', price: '0.01' },
        { name: 'price3', price: '2000.00' },
        { name: 'price4', price: '40000.00' },
        { name: 'price5', price: null },
      ])
    )
  );

  test.skip(
    'Filter: price',
    withKeystone(({ keystone }) =>
      match(keystone, { price: '50.00' }, [{ name: 'price1', price: '50.00' }])
    )
  );

  test.skip(
    'Filter: price_not',
    withKeystone(({ keystone }) =>
      match(keystone, { price_not: '50.00' }, [
        { name: 'price2', price: '0.01' },
        { name: 'price3', price: '2000.00' },
        { name: 'price4', price: '40000.00' },
        { name: 'price5', price: null },
      ])
    )
  );

  test.skip(
    'Filter: price_lt',
    withKeystone(({ keystone }) =>
      match(keystone, { price_lt: '50.00' }, [{ name: 'price2', price: '0.01' }])
    )
  );

  test.skip(
    'Filter: price_lte',
    withKeystone(({ keystone }) =>
      match(keystone, { price_lte: '2000.00' }, [
        { name: 'price1', price: '50.00' },
        { name: 'price2', price: '0.01' },
        { name: 'price3', price: '2000.00' },
      ])
    )
  );

  test.skip(
    'Filter: price_gt',
    withKeystone(({ keystone }) =>
      match(keystone, { price_gt: '2000.00' }, [{ name: 'price4', price: '40000.00' }])
    )
  );

  test.skip(
    'Filter: price_gte',
    withKeystone(({ keystone }) =>
      match(keystone, { price_gte: '2000.00' }, [
        { name: 'price3', price: '2000.00' },
        { name: 'price4', price: '40000.00' },
      ])
    )
  );
};
