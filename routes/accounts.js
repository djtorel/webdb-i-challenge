const express = require('express');

const db = require('../data/dbConfig');

db.on('query', console.log);

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const accounts = await db('accounts');
    res.status(200).json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [account] = await db('accounts').where({ id });
    account
      ? res.status(200).json(account)
      : res
          .status(404)
          .json({ message: `Could not find account with id ${id}` });
  } catch (err) {
    res.status(500).status({ message: 'failed to get account', error: err });
  }
});

router.post('/', async (req, res) => {
  const accountData = req.body;

  try {
    const [id] = await db('accounts').insert(accountData);
    const [newAccount] = await db('accounts').where({ id });
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(500).json({ message: 'failed to add account', error: err });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    const count = await db('accounts')
      .where('id', '=', id)
      .update(changes);
    const [updatedAccount] = await db('accounts').where({ id });
    count
      ? res.status(200).json(updatedAccount)
      : res.status(404).json({ message: `could not find account ${id}` });
  } catch (err) {
    res.status(500).json({ message: 'could not update account' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [deletedAccount] = await db('accounts').where({ id });
    const count = await db('accounts')
      .where({ id })
      .del();
    count
      ? res.status(200).json(deletedAccount)
      : res.status(404).json({ message: `could not find account ${id}` });
  } catch (err) {
    res.status(500).json({ message: 'could not delete account' });
  }
});

module.exports = router;
