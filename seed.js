const users = require('./data/users');
const event = require('./data/event');
const connection = require('./config/mongoConnection');

const main = async () => 
{
    const db = await connection.dbConnection();
    await db.dropDatabase();

    try
    {
        let user1 = await users.createUser("CodyF02","Password1!","Cody","Fernandez","2002-05-25","cfernan2@stevens.edu");
        let user2 = await users.createUser("eltonvaz623","Eltonv#05","Elton","Vaz","2002-04-30","evaz@stevens.edu");
        let user3 = await users.createUser("SriBL","Password1!","Hari","Shankar","2002-04-11","srishankar@stevens.edu");
        let user4 = await users.createUser("TBayryyev","Password1!","Tahyr","Bayryyev","2002-02-10","TBayryyev@stevens.edu");

    } 
    catch (e) 
    {
      console.log(e);
    } 

    try
    {
        let event1 = await event.createEvent("Soccer Match","Come watch the local high school team play this weekend!","2023-10-28","13:00","Hoboken High School", 5);
        let event2 = await event.createEvent("Art Gallery","Discover local talent and global creativity at our university art gallery","2023-11-01","20:00","Stevens UCC", 10);
        let event3 = await event.createEvent("Haunted House","Experience spine-tingling thrills and eerie chills at our haunted house","2023-10-30","19:00","Hoboken Haunted House", 20);
    } 
    catch (e) 
    {
      console.log(e);
    } 
    
      
    await connection.closeConnection();

}

main();