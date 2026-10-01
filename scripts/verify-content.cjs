const { chromium } = require('@playwright/test');
(async () => {
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 for (const [route,name] of [['/','home-desktop'],['/services/recruitment','recruitment-desktop'],['/resources/hiring-for-lasting-fit','article-desktop']]) {
  await page.goto('http://127.0.0.1:3001'+route,{waitUntil:'networkidle'});
  for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=800){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(120);}
  await page.evaluate(()=>scrollTo(0,0)); await page.waitForTimeout(500);
  console.log(route,await page.locator('h1').innerText(),await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length})));
  await page.screenshot({path:'docs/'+name+'.png',fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:3001/services/recruitment',{waitUntil:'networkidle'});
 console.log('mobile service overflow',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 await page.screenshot({path:'docs/recruitment-mobile.png',fullPage:true});
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
