import { createImage } from '/lib/image-creator';

export default async function handler(req, res) {

    let imageDescription = {};
    if(Object.keys(req.query).includes('title') === true){
        imageDescription['title'] = decodeURIComponent(req.query['title']);
    }
    else {
        imageDescription['title'] = '';
    }

    if(Object.keys(req.query).includes('title') === true){
        imageDescription['author'] = req.query['author'];
    }
    else {
        imageDescription['author'] = '';
    }

    if(Object.keys(req.query).includes('creation_time') === true){
        imageDescription['creation_time'] = decodeURIComponent(req.query['creation_time']);
    }
    else {
        imageDescription['creation_time'] = '';
    }

    // for testing
    // imageDescription = {
    //     title: "The Limits to Blockchain Scalability",
    //     author: "vitalik.eth",
    //     creation_time: "8:00 AM • Jun 16, 2021"
    // }

    let imageBuffer = await createImage(imageDescription);
    res.setHeader('Content-Type', 'image/jpg');
    res.send(imageBuffer);
}
