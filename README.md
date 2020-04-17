# parse-access-logs

Node.js command line app that parses out access logs from various formats and outputs them to a csv file

---

### **Startup**

* Checkout project
  * Https clone
    
    $ `git clone https://github.com/bradr5/parse-access-logs.git`

  * SSH clone
    
    $ `git clone git@github.com:bradr5/parse-access-logs.git`

* Running without docker
  * Install modules
  
    $ `npm install`

  * Run script
    
    $ `node parse.js file-to-be-parsed.log /output/location.csv`

  * Only the input file is required, output file defauls to access-log-data.csv in your current directory

  * Example access logs are included in the example-logs directory

* Running with docker

  *warning* - I had issues with getting the container to remain open. I wanted to make the containers only job to run the parse job however after doing so the container will stop. This makes copying files over and pulling them out tricky. I definitely have some research to do.
  * Build the image

    $ `docker build -t image-name .`

  * Run the container - without copying over files you must use example logs copied over during the build

    $ `docker run -it image-name example-logs/gobankingrates.com.access.log`

* Running tests

  * This project does not include nearly as many tests as it should but I wanted a create a good starting point

    $ `npm run test`