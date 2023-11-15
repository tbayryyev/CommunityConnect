const assert = require('assert');
const users = require('../data/users');

describe('Login Function', () => {
    it('should return true since this user is in database', async () => {
        const user = await users.checkUser('codyf02', 'Password1!');
        assert.equal(user.authenticatedUser,true);
    });
    it('should return true since this user is in database', async () => {
        const user = await users.checkUser('eltonvaz623', 'Eltonv#05');
        assert.equal(user.authenticatedUser,true);
    });
    it('should throw an error for an invalid login because password is incorrect', async () => {
        try {
          await users.checkUser('tbay123', 'Tahyr123');
          assert.fail('Expected an error to be thrown');
        } catch (error) {
          assert.strictEqual(error, 'Error: Either the username or password is invalid');
        }
      });
      it('should throw an error for an invalid login because username is incorrect', async () => {
        try {
          await users.checkUser('tbay12', 'Tahyr123!');
          assert.fail('Expected an error to be thrown');
        } catch (error) {
          assert.strictEqual(error, 'Error: Either the username or password is invalid');
        }
      });
    it('should throw an error for an invalid login because both username and password incorrect', async () => {
        try {
          await users.checkUser('hello', 'hello1234!');
          assert.fail('Expected an error to be thrown');
        } catch (error) {
          assert.strictEqual(error, 'Error: Either the username or password is invalid');
        }
      });
      it('should throw an error for using number as username instead of string', async () => {
        try {
          await users.checkUser(123, 'hello1234!');
          assert.fail('Expected an error to be thrown');
        } catch (error) {
          assert.strictEqual(error, 'Error: input must be a string');
        }
      });
      it('should throw an error for using number as password instead of string', async () => {
        try {
          await users.checkUser('hello', 1242);
          assert.fail('Expected an error to be thrown');
        } catch (error) {
          assert.strictEqual(error, 'Error: input must be a string');
        }
      });
    

    

  
});
