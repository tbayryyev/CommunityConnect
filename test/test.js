const assert = require('assert');
const users = require('../data/users');

describe('Login Function', () => {
    it('should return true since this user is in database', async () => {
        const user = await users.checkUser('agilebreezy', 'Team2rules!');
        assert.equal(user.authenticatedUser,true);
    });
    it('should return true since this user is in database', async () => {
        const user = await users.checkUser('tbay123', 'Tahyr123!');
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
    

  
});
