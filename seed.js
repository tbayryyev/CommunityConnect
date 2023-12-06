const users = require('./data/users');
const event = require('./data/event');
const connection = require('./config/mongoConnection');


const main = async () => 
{
    const db = await connection.dbConnection();
    await db.dropDatabase();

    try
    {
        let user1 = await users.createUser("codyf02","Password1!","Cody","Fernandez","2002-05-25","cfernan2@stevens.edu");
        let user2 = await users.createUser("eltonvaz623","Eltonv#05","Elton","Vaz","2002-04-30","evaz@stevens.edu");
        let user3 = await users.createUser("SriBL","Password1!","Hari","Shankar","2002-04-11","srishankar@stevens.edu");
        let user4 = await users.createUser("TBayryyev","Password1!","Tahyr","Bayryyev","2002-02-10","TBayryyev@stevens.edu");
        let user5 = await users.createUser("emilyBrown456", "Password1!", "Emily", "Brown", "1988-12-18", "emily@example.com");
        let user6 = await users.createUser("jasonDoe789", "Password1!", "Jason", "Doe", "1996-09-03", "jason@example.com");
        
    } 
    catch (e) 
    {
      console.log(e);
    } 

    try
    {
      // Set all event links to null
      const eventLinks = {
        "Soccer Match": null,
        "Art Gallery": null,
        "Haunted House": null,
        "Coding Workshop": null,
        "Book Club Meeting": null,
        "Fitness Bootcamp": null,
        "Financial Planning Seminar": null,
        "Networking Mixer": null,
        "Technology Conference": null,
        "Hiking Adventure": null,
        "Music Concert": null,
        "Charity Fundraiser": null
        };

        let event1 = await event.createEvent("codyf02", "Soccer Match", "Come watch the local high school team play this weekend!", "2023-10-28", "13:00", "Hoboken High School", 5, eventLinks["Soccer Match"],"https://cloudfront-us-east-2.images.arcpublishing.com/reuters/7YKAJ3JWWJNL7PGRPZKY2TEU5Y.jpg");
        let event2 = await event.createEvent("eltonvaz623", "Art Gallery", "Discover local talent and global creativity at our university art gallery", "2023-11-01", "20:00", "Stevens UCC", 10, eventLinks["Art Gallery"],"https://d1inegp6v2yuxm.cloudfront.net/royal-academy/image/upload/c_limit,cs_tinysrgb,dn_72,f_auto,fl_progressive.keep_iptc,w_1200/ioe5yo8wutsketramhnf.jpg");
        let event3 = await event.createEvent("SriBL", "Haunted House", "Experience spine-tingling thrills and eerie chills at our haunted house", "2023-10-30", "19:00", "Hoboken Haunted House", 20, eventLinks["Haunted House"],"https://danielwcheely.files.wordpress.com/2016/03/haunted-house-color.jpg?w=676");
        let event4 = await event.createEvent("TBayryyev", "Coding Workshop", "Join us for an interactive coding workshop!", "2023-11-05", "14:30", "Tech Hub", 15, eventLinks["Coding Workshop"],"https://cms-assets.themuse.com/media/lead/01212022-1047259374-coding-classes_scanrail.jpg");
        let event5 = await event.createEvent("eltonvaz623", "Book Club Meeting", "Discussing the latest bestseller - everyone's welcome!", "2023-11-10", "18:00", "Library", 10, eventLinks["Book Club Meeting"],"https://image.cnbcfm.com/api/v1/image/104702698-GettyImages-583816330-book-club.jpg?v=1532563764");
        let event6 = await event.createEvent("SriBL", "Fitness Bootcamp", "Get fit together in this high-energy bootcamp session!", "2023-11-15", "07:00", "City Park", 25, eventLinks["Fitness Bootcamp"],"https://tunturi.org/Blogs/2021-08/bootcamp-full-body-workout.jpg");
        let event7 = await event.createEvent("TBayryyev", "Financial Planning Seminar", "Learn smart financial strategies for the future!", "2023-11-20", "16:00", "Financial Center", 30, eventLinks["Financial Planning Seminar"],"https://smartasset.com/wp-content/uploads/sites/2/2022/08/plan-1.jpg");
        let event8 = await event.createEvent("codyf02", "Networking Mixer", "Connect and network with professionals from various industries.", "2023-11-25", "18:30", "Business Club", 20, eventLinks["Networking Mixer"],"https://imageio.forbes.com/specials-images/dam/imageserve/1135040422/960x0.jpg?height=474&width=711&fit=bounds");
        let event9 = await event.createEvent("emilyBrown456", "Technology Conference", "Delve into the future of technology with industry experts.", "2023-11-10", "09:30", "Conference Center", 40, eventLinks["Technology Conference"],"https://www.travelperk.com/wp-content/uploads/alex-kotliarskyi-ourQHRTE2IM-unsplash-1024x683.jpg");
        let event10 = await event.createEvent("emilyBrown456", "Hiking Adventure", "Embark on an exciting hiking trail!", "2023-11-25", "08:00", "Mountain Park", 10, eventLinks["Hiking Adventure"],"https://www.outdoyo.com/media/filer_public/fd/e2/fde2caf2-deb8-437b-9aea-2eaed1b726d8/hiking-trail.jpg");
        let event11 = await event.createEvent("jasonDoe789", "Music Concert", "Live music performance by renowned artists", "2023-12-01", "19:00", "Concert Hall", 30, eventLinks["Music Concert"],"https://d194ip2226q57d.cloudfront.net/images/House-Concert_CO-Katie-Jones.original.jpg");
        let event12 = await event.createEvent("jasonDoe789", "Charity Fundraiser", "Support a cause and make a difference!", "2023-12-15", "16:30", "Community Center", 25, eventLinks["Charity Fundraiser"],"https://cdn.shopify.com/s/files/1/2572/3764/files/Outdoor_Charity_Fundraiser_Tips-min_1024x1024.jpg?v=1639405017");
      
    } 
    catch (e) 
    {
      console.log(e);
    } 
    
      
    await connection.closeConnection();

}

main();