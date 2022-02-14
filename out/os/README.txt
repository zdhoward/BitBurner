Planning for:
 ▄███████▄  ▀████    ▐████▀  ▄██████▄     ▄████████ 
██▀     ▄██   ███▌   ████▀  ███    ███   ███    ███ 
      ▄███▀    ███  ▐███    ███    ███   ███    █▀  
 ▀█▀▄███▀▄▄    ▀███▄███▀    ███    ███   ███        
  ▄███▀   ▀    ████▀██▄     ███    ███ ▀███████████ 
▄███▀         ▐███  ▀███    ███    ███          ███ 
███▄     ▄█  ▄███     ███▄  ███    ███    ▄█    ███ 
 ▀████████▀ ████       ███▄  ▀██████▀   ▄████████▀  
                                                    

Core Idea:
Minimize ram costs by breaking down each module into small files that call others when needed
Having script talk to eachother will be key. Can be done through ports or tmp files. Files are more persistent.
Hardcode values as much as possible, if it doesn't exist, dont run the function

Values I Can Hardcode (in config.js):
- All Servers
- Botnet (BOT-1 -> Bot-25)
- Factions
- Augs 

Structure:
- core.js
- config.js

- hackServers.js // remoteHacker: "Pick a best target and aim all remotes at it - batches are not an option", main+botsHacker: "Batches are preferable but don't scale well"
- /payloads/hack.js
- /payloads/weaken.js
- /payloads/grow.js 
- /payloads/share.js

- factionManager.js
- /factions/harvestInfo.js
- /factions/suggestAugs.js
- /factions/purchaseAugs.js

- contractManager.js

- stockManager.js
- /stocks/harvestInfo.js
- /stocks/tradeStocks.js

- corporationManager.js
- /corps/harvestInfo.js 
- /corps/setup.js
- ???

- hacknetManager.js

- /tmp/
- /tmp/servers.json
- /tmp/factions.json
- /tmp/stocks.json
- /tmp/corps.json

Milestones:
$0 - Startup
$20m - home RAM big enough for ui+contracts+hacking (64Gb?)
$32b - StockMarket Access
$150b - Corporation
$ceiling - faction-manager