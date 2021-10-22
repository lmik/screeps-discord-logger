const {
  ScreepsAPI
} = require('screeps-api');
const axios = require("axios");
const stripHtml = require("string-strip-html");

console.log(stripHtml);

const hook = "<your discord webhook address here>";

const setup = async () => {
  try {
    const api = await ScreepsAPI.fromConfig("main", );
    await api.socket.connect(); // connect socket

    // You can also put a callback to subscribe()
    api.socket.subscribe('console', event => {
      const messages = event.data.messages.log;
      console.log(messages);
      if (messages.length > 0) {
        let i = 0;
        let payload = "";
        while (i < messages.length) {
          
          const msg = stripHtml.stripHtml(messages[i]).result;
          if(msg.includes("[trade]") || msg.includes("critially full")) {
            i++
            continue;
          }
          if ((payload.length + msg.length) > 2000) {
            try {
              axios({
                method: 'post',
                url: hook,
                data: {
                  content: payload
                }
              });
            } catch (exc) {
              console.log(exc)
            }
            payload = "";
            i--;
          } else {
            payload += "\n" + msg;
            i++;
          }
        }

        if(payload.length>0) {
          try {
            axios({
              method: 'post',
              url: hook,
              data: {
                content: payload
              }
            });
          } catch (exc) {
            console.log(exc)
          }
        }
      }
    })
  } catch (err) {
    console.log(err);
  }
}

setup().then(() => {});