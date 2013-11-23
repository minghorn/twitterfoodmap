var request = Npm.require("request");
var querystring = Npm.require("querystring");
var Future = Npm.require("fibers/future");

Accounts.onCreateUser(function(options, user) {

    var url = "https://api.twitter.com/1.1/users/show.json?" +
              querystring.stringify({screen_name: user.services.twitter.screenName});
    var fut = new Future();
    var twitter_info = Accounts.loginServiceConfiguration.findOne({service: 'twitter'});
    request({url: url,
             json: true,
             oauth: {consumer_key: twitter_info["consumerKey"],
                     consumer_secret: twitter_info["secret"],
                     token: user.services.twitter.accessToken,
                     token_secret: user.services.twitter.accessTokenSecret}},
            function (e, r, body) {
               if (e) {
                   fut.throw(e);
               }
               fut.return(body);
            });

    var result = fut.wait();
    
	user.profile = _.pick(result,
		                  "name",
		                  "profile_image_url",
		                  "location",
		                  "user_id");
	
	return user;
	
});
		