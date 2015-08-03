import Chai from 'chai';
const expect = Chai.expect;

import fun from '../lib/fun';

const _ = fun.wildcard;
const $ = fun.parameter;

describe('fun', () => {
  it('must correctly evaluate example', () => {

    let fact = fun(
        [0, () => 1],
        [$, (n) => n * fact(n - 1)]
    );

    expect(fact(0)).to.equal(1);
    expect(fact(10)).to.equal(3628800);
  });

  it('must throw error when no match is found', () => {

    let fact = fun(
        [0, () => 1],
        [10, (n) => n * fact(n - 1)]
    );

    expect(fact.bind(fact, 1)).to.throw("No match for: 1");
  });

  it('must have wildcard except everything', () => {

    let fact = fun(
        [_, () => 1]
    );

    expect(fact(1)).to.equal(1);
    expect(fact("1")).to.equal(1);
    expect(fact("ABC")).to.equal(1);
    expect(fact(()=> 34)).to.equal(1);
  });

  it('must work symbols', () => {

    let fact = fun(
        [Symbol.for('infinity'), () => 1]
    );

    expect(fact(Symbol.for('infinity'))).to.equal(1);
    expect(fact.bind(fact, Symbol('infinity'))).to.throw("No match for: Symbol(infinity)");
  });
});
