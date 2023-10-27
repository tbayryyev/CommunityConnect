const users = require('./data/users');
const connection = require('./config/mongoConnection');

const main = async () => 
{
    const db = await connection.dbConnection();
    await db.dropDatabase();

    try
    {
        let user1 = await users.createUser("CodyF02","Password1!","Cody","Fernandez","2002-05-25","cfernan2@stevens.edu");
        let user3 = await users.createUser("eltonvaz623","Eltonv#05","Elton","Vaz","2002-07-10","evaz@stevens.edu");
        let user4 = await users.createUser("SriBL","Password1!","Hari","Shankar","2002-04-11","srishankar@stevens.edu");
        let user5 = await users.createUser("TBayryyev","Eltonv#05","Tahyr","Bayryyev","2002-02-10","TBayryyev@stevens.edu");

    } 
    catch (e) 
    {
      console.log(e);
    } 
    
      
    await connection.closeConnection();

}

main();