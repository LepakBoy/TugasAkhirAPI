
const GetFlickrHome = async (req, res) => {
    const flickrHome = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1";
    let data = await getData()
    let items = []
    function getData(){
        let data = fetch(flickrHome)
        .then((obj) => obj.json())
        .catch((error) => {
            console.error(error);
        });
        return data
    }
    if (data){
        
        for (let i = 0; i < data.items.length; i++) {
            let obj = {
                "id": i+1,
                "title": data.items[i].title,
                "url": data.items[i].media.m
            }
            items.push(obj)
        }
        var response = {
            "status": "Success",
            "code": 200,
            "data": {
                "searchTitle": "Looking for image?",
                "items": items,   
            }
        }

    } else {
        var response = {
            "status": "Error",
            "code": 400,
      
        }
    }


    return res.json(response);
};

const PostFlickrByTag = async (req, res) => {
    const tags = req.body.tags;
    const flickrHome = `https://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1&tags=${tags}`;
    let data = await getData()
    let items = []
    function getData(){
        let data = fetch(flickrHome)
        .then((obj) => obj.json()).catch((error) => {
            console.error(error);
        });
        return data
    }
    if (data){
        
        for (let i = 0; i < data.items.length; i++) {
            let obj = {
                "id": i+1,
                "title": data.items[i].title,
                "url": data.items[i].media.m
            }
            items.push(obj)
        }
        var response = {
            "status": "Success",
            "code": 200,
            "data": {
                "searchTitle": data.title,
                "items": items,   
            }
        }

    } else {
        var response = {
            "status": "Error",
            "code": 400,
      
        }
    }


    return res.json(response);
};

module.exports = {
    GetFlickrHome,
    PostFlickrByTag
};
