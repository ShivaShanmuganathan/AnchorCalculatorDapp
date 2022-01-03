// import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Mycalculatordapp } from '../target/types/mycalculatordapp';

const assert = require('assert');
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

describe('mycalculatordapp', () => {

  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Mycalculatordapp;
  let _calculator;
  it('Creates a calculator', async () => {
    
    await program.rpc.create("Welcome to Solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator]
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.greeting === "Welcome to Solana");
    _calculator = calculator;

  });

  

  it("Adds two numbers", async function() {

    const calculator = _calculator;

    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(5)));
    assert.ok(account.greeting === "Welcome to Solana");

  });

  it('Multiplies two numbers', async function() {

    const calculator = _calculator;

    await program.rpc.multiply(new anchor.BN(9), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(45)));
    assert.ok(account.greeting === "Welcome to Solana");

  })

  it('Subtracts two numbers', async function() {

    const calculator = _calculator;

    await program.rpc.subtract(new anchor.BN(100), new anchor.BN(10), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(90)));
    assert.ok(account.greeting === "Welcome to Solana");

  });

  it('Divides two numbers', async function() {

    const calculator = _calculator;
    const account_before = await program.account.calculator.fetch(calculator.publicKey);
    await program.rpc.divide(account_before.result, new anchor.BN(4), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(22)));
    assert.ok(account.remainder.eq(new anchor.BN(2)));
    assert.ok(account.greeting === "Welcome to Solana");

  });

});
