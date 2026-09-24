// 1. SELECT EXISTING DOM ELEMENTS
const shortenerForm   = document.getElementById('shortener-form');
const longUrlInput    = document.getElementById('long-url');
const shortenBtn      = document.getElementById('shorten-btn');
const resultContainer = document.getElementById('result-container');
const shortUrlInput   = document.getElementById('short-url');
const copyBtn         = document.getElementById('copy-btn');
const copyStatus      = document.getElementById('toast');
const BIN_ID = "6a99d747da38895dfe356ff8"
resultContainer.style.display = 'none';

async function readLinks() {
  // 1. Fixed URL to use 'api.jsonbin.io/v3/b/'
  // 2. Removed 'body: JSON.stringify(myData)' because GET requests cannot have a body
  const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'GET',
    headers: {
      'X-Master-Key': '$2a$10$m7MRxjxlfneEDez2faIJ4ulRzzvuLU3Mv.6B9mS/1wIOFNosaeGcW'
    }
  });
  const result = await response.json();
  console.log(result.record);  
  // JSONBin v3 returns your data wrapped inside a "record" object
  return result.record; 
}

async function saveToCloudBin(myData) {
  // 1. Fixed URL to point directly to your specific bin route
  const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT', 
      headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': '$2a$10$m7MRxjxlfneEDez2faIJ4ulRzzvuLU3Mv.6B9mS/1wIOFNosaeGcW'
      },
      body: JSON.stringify(myData) 
  });
  
  const result = await response.json();
  console.log("Saved successfully:", result);
  return result;
}



function generateId(minDigits, maxDigits) {
  const digits = Math.floor(Math.random() * (maxDigits - minDigits + 1)) + minDigits;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

 return (Math.floor(Math.random() * (max - min + 1)) + min)
}



// A sample function demonstrating how to add a new link
async function addNewLink(urlPath) {
  try {
    console.log("Fetching current database...");
    const dbData = await readLinks(); // 1. Read your existing data
    
    console.log("Generating unique ID...");
    // 2. Generate a unique ID safely using our optimized local-check method
    const uniqueId = await checkIdSafer(dbData); 
    
    // 3. Create your new item object
    const newLinkItem = {
      [uniqueId]: {
        url: urlPath
      }
    };
    
    // 4. Push the new item into your existing array
    dbData.links.push(newLinkItem);
    
    console.log("Writing updated data back to JSONBin...");
    // 5. Write the ENTIRE updated object back to the cloud
    await saveToCloudBin(dbData);
    console.log(`Success! Saved with ID: ${uniqueId}`);
    return uniqueId;
  } catch (error) {
    console.error("Something went wrong during the write process:", error);
  }
}

// Updated safer checkId function that takes the dbData directly
async function checkIdSafer(dbData) {
  while (true) {
    const num = generateId(3, 17);
    const idExists = dbData.links.some(item => item.id === num);
    if (!idExists) {
      return num; 
    }
  }
}
// 3. TOAST POPUP LOGIC
function showPopup() {
  copyStatus.classList.add('show');
  setTimeout(() => {
    copyStatus.classList.remove('show');
  }, 3000);
}

// 4. ROUTER / REDIRECT LOGIC (RUNS IMMEDIATELY ON LOAD)
async function handleRouting() {
  const hash = window.location.hash;
  console.log("1. Current Hash:", hash);

  // Check if it matches #/ followed by numbers
  const match = hash.match(/^#\/(\d+)$/);
  console.log("2. RegExp Match result:", match);

  if (!match) {
    console.log("-> Failed at Step 2: Hash format does not match #/digits. Stopping router.");
    return; 
  }

  // match[1] extracts the exact captured digits inside (\d+)
  const numberString = match[1]; 
  console.log("3. Target ID to look up:", numberString);
  
  try {
    console.log("4. Fetching database...");
    const dbData = await readLinks();
    console.log("5. Raw DB Data retrieved:", dbData);
    
    // Safety check parsing
    const data = typeof dbData === 'string' ? JSON.parse(dbData) : dbData;
    const linksArray = Array.isArray(data) ? data : data.record || [];
    console.log("6. Extracted Links Array:", linksArray);
    const matchedObject = data.links.find(item => Object.prototype.hasOwnProperty.call(item, numberString));

    console.log("7. Matched object found in DB:", matchedObject);

// 2. Extract the url safely by checking if the object and the key exist
const destinationUrl = matchedObject ? matchedObject[numberString].url : null;

    console.log("8. Destination URL:", destinationUrl);

    if (destinationUrl && /^https?:\/\//i.test(destinationUrl)) {
      console.log("SUCCESS! Redirecting to:", destinationUrl);
      
      // Hide home elements if they exist
      if (typeof shortenerForm !== 'undefined' && shortenerForm) {
        shortenerForm.style.display = 'none';
      }
      
      window.location.href = destinationUrl;
      return; 
    } else {
      console.error("-> Failed at Step 8: Destination URL is empty or invalid format.");
    }
  } catch (err) {
    console.error("Routing execution encountered a crash:", err);
  }
}


// 5. EVENT LISTENERS
shortenBtn.addEventListener("click", async (e) => {
  if (e) e.preventDefault(); // Prevent accidental form reload
  
  let link = longUrlInput.value;
  if (!link) return alert("Please enter a link!");

  // Ensure link has http:// or https:// protocol prefix
  if (!/^https?:\/\//i.test(link)) {
    link = 'https://' + link;
  }
  let id = await addNewLink(link)
  const generatedLink = "https://web-platform-ydpvmkku.stackblitz.io#/" + id;

  // Populate output box and display it
  shortUrlInput.value = generatedLink;
  resultContainer.style.display = 'block';
});
copyBtn.addEventListener("click", () => {
  let linkToCopy = shortUrlInput.value;
  navigator.clipboard.writeText(linkToCopy);
  showPopup();
});

// Watch for manual path changes without page reloads
window.addEventListener('hashchange', handleRouting)


window.addEventListener('DOMContentLoaded', handleRouting);
// Check URL parameters when the website first fires up
handleRouting()
