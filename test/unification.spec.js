import Chai from 'chai';
const expect = Chai.expect;

import funcy from '../lib/funcy';

describe('example', () => {
  it('must evaluate expression correctly', ()=>{
    let a = { text: 'Hello', name: 'World!' };
    let b = { text: funcy.variable('text'), name: 'World!' };

    let c = funcy.unify(a, b);
    expect(c.text).to.equal('Hello');
  });

  it('blah', ()=>{
    let a = {a: funcy.variable('a')};
    let b = {a: 1};
    let { a: c } = funcy.unify(a, b);
    expect(c).to.equal(1);
  });
});
