# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

It uses a query perameter (image_url) to get the image to which we want to apply filter.

after deploying it like a typical node application you can visit http://{{HOST}}:8082/filteredimage?image_url={{any image url}} and see you will see that the filter will be applied to that image.

eg, visit: http://udagram-img-filter-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://images.wallpaperscraft.com/image/houses_forest_trees_169252_3659x5489.jpg

## Setup Guide

You'll need to create a new node server. Open a new terminal within the project directory and run:

1. cd in your desired folder and clone this project by: `git clone https://github.com/umer2001/udagram.git`
2. Initialize a new project: `npm i`
3. run the development server with `npm run dev`
4. test it by visiting http://localhost:8082/filteredimage?image_url=https://images.wallpaperscraft.com/image/houses_forest_trees_169252_3659x5489.jpg
