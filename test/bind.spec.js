import Chai from 'chai';
const expect = Chai.expect;

import fun from '../lib/funcy/fun';

const _ = fun.wildcard;
const $ = fun.parameter;

describe('bind', () => {
  it('must return value on parameter', () => {
    let [a] = fun.bind($, 1);
    expect(a).to.equal(1);
  });

  it('must ignore value when wildcard given', () => {
    let [a] = fun.bind(_, 1);
    expect(a).to.equal(undefined);
  });

  it('must match on multiple values when an array is given', () => {
    let [a, ] = fun.bind([$, 2, _, 4], [1, 2, 3, 4]);
    expect(a).to.equal(1);
  });

  it('must throw an error when there is no match', () => {
    expect(fun.bind.bind(fun.bind, [$, 2, _, 4], 1)).to.throw("No match for: 1");
  });

  it('must match values in object', () => {
    let [a] = fun.bind({a: [1, $, 3]}, {a: [1, 2, 3]});
    expect(a).to.equal(2);
  });

  it('must match on bound variables', () => {
    let a = 1;

    let [b] = fun.bind(fun.bound(a), 1);
    expect(b).to.equal(1);

    let c = {a: 1};

    let [d] = fun.bind(fun.bound(c), {a: 1});
    expect(d.a).to.equal(1);
  });

  it('must throw an error when bound value does not match', () => {
    let a = 1;
    expect(fun.bind.bind(fun.bind, fun.bound(a), 2)).to.throw("No match for: 2");
  });
});
