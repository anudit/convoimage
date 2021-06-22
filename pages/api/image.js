import { createImage } from '/lib/image-creator';

export default async function handler(req, res) {

    let imageDescription = {};

    if(Object.keys(req.body).includes('title') === true){
        imageDescription['title'] = req.body['title'];
    }
    else {
        imageDescription['title'] = '';
    }

    if(Object.keys(req.body).includes('title') === true){
        imageDescription['author'] = req.body['author'];
    }
    else {
        imageDescription['author'] = '';
    }

    if(Object.keys(req.body).includes('creation_time') === true){
        imageDescription['creation_time'] = req.body['creation_time'];
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
