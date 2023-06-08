# Yattee Auto Manifest

Simple node.js script with a web server that automatically fetches [Piped](https://piped-instances.kavin.rocks/) and [Invidious](https://api.invidious.io/instances.json) instances, then parses the data into the Yattee location manifest file [format](https://github.com/yattee/yattee.github.io/blob/main/manifest-invidious-piped.json). You can see it hosted [here](https://yattee-auto-manifest.cyclic.app). The links should automatically update as the Piped and Invidious lists are updated. 

I made this more for personal use, but feel free to create an issue if you have something that you would like to see added. 


### To-do (this will never happen ;)
1. A page that will query each server (client-side) and compile a manifest object of the fastest servers.
2. Manifest files that are "country" and "region" neutral.


