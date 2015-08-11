import Chai from 'chai';
const expect = Chai.expect;

import fun from '../lib/funcy/fun';

const _ = fun.wildcard;
const $ = fun.parameter;

describe('example', () => {
  it('must correctly evaluate example', () => {

    let fact = fun(
        [[0], () => 1],
        [[$], (n) => n * fact(n - 1) ]
    );

    let response = fact(0);
    expect(response).to.equal(1);

    response = fact(10);
    expect(response).to.equal(3628800);
  });
});

describe('fun', () => {
  it('must throw error when no match is found', () => {

    let fn = fun(
        [[0], () => 1]
    );

    expect(fn.bind(fn, 1)).to.throw("No match for: 1");
  });

  it('must have wildcard except everything', () => {

    let fn = fun(
        [[_], () => 1]
    );

    expect(fn(1)).to.equal(1);
    expect(fn("1")).to.equal(1);
    expect(fn("ABC")).to.equal(1);
    expect(fn(() => 34)).to.equal(1);
  });

  it('must work symbols', () => {

    let fn = fun(
        [[Symbol.for('infinity')], () => 1]
    );

    expect(fn(Symbol.for('infinity'))).to.equal(1);
    expect(fn.bind(fn, Symbol('infinity'))).to.throw("No match for: Symbol(infinity)");
  });

  it('must match on values in object', () => {

    let fn = fun(
        [[{value: $}], (val) => 1 + val],
        [[{a: {b: {c: $} } }], (val) => 1 - val]
    );

    expect(fn({value: 20})).to.equal(21);
    expect(fn({a: {b: {c: 20} } })).to.equal(-19);
  });

  it('must match on objects even when value has more keys', () => {

    let fn = fun(
        [[{value: $}], (val) => 1 + val],
        [[{a: {b: {c: $} } }], (val) => 1 - val]
    );

    expect(fn({value: 20})).to.equal(21);
    expect(fn({a: {b: {c: 20}, d: 10 } })).to.equal(-19);
  });

  it('must match on substrings', () => {

    let fn = fun(
        [[fun.startsWith("Bearer ")], (token) => token]
    );

    expect(fn("Bearer 1234")).to.equal("1234");
  });


  it('must work with guards', () => {

    let fn = fun(
        [[$], (number) => number, (number) => number > 0]
    );

    expect(fn(3)).to.equal(3);
    expect(fn.bind(fn, -1)).to.throw("No match for: -1");
  });

  it('must capture entire match as parameter', () => {

    let fn = fun(
        [[fun.capture({a: {b: {c: $} } })], (val, bound_value) => bound_value.a.b.c]
    );

    expect(fn({a: {b: {c: 20} } })).to.equal(20);

    fn = fun(
        [[fun.capture([1, $, 3, $])], (a, b, bound_value) => bound_value.length]
    );

    expect(fn([1, 2, 3, 4])).to.equal(4);

    fn = fun(
        [[fun.capture([1, fun.capture({a: {b: {c: $} } }), 3, $])], (c, two, four, arg) => two.a.b.c]
    );

    expect(fn([1, {a: {b: {c: 20} } }, 3, 4])).to.equal(20);
  });

  it('must produce a head and a tail', () => {

    let fn = fun(
        [[fun.headTail], (head, tail) => tail]
    );

    expect(fn([3, 1, 2, 4]).length).to.equal(3);
  });
});
