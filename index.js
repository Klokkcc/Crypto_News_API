const express = require("express");
const request =require("request-promise");
const cheerio = require('cheerio');
const { initParams } = require("request");
const app = express();
const PORT=process.env.PORT || 5000;
const apiKey='<YOUR_KEY_FROM_SCRAPER_API>';
const baseUrl=`http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`
const articles=[];
const info=[];
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Welcome')
})
app.get('/news-list',async(req,res)=>{
    try{
        const response=await request(`${baseUrl}&url=https://cryptonews.com/news/`)
      const $=await cheerio.load(response);
      const $selected=$('[class="mb-15 mb-sm-30 article-item"]')
      await $selected.each(function(e){
        const img=$(this).children('.row').children('[class="col-12 d-none col-md-5 d-md-block column-45__left"]').children('a').children('div').children('img').attr('src');
        const href=$(this).children('.row').children('[class="col-12 col-md-7 column-45__right d-flex flex-column justify-content-center"]').children('a').attr('href');
        let id='';
          for(let i=6;i<href.length;i++){
            id=id+href[i];
          }
         
         const title=$(this).children('.row').children('[class="col-12 col-md-7 column-45__right d-flex flex-column justify-content-center"]').children('a').text();
        articles.push({
                img,
                title,
                id
                
                
        })
      })
            
    
      await res.json(articles)
    }catch(err){
        res.json(err)
        console.log(err)
    }
    
})
//Here you give id of article which you get from first endpoint
app.get('/news/:id',async(req,res)=>{
  const{ id}=req.params
  
  try{
      const response=await request(`${baseUrl}&url=https://cryptonews.com/news/${id}`)
    const $=await cheerio.load(response);
    const $selected=$('[class="content-img"]')
    const $selected1=$('[class="mb-40"]')
    const $selected2=$('p')
      const img=$selected.attr('src');
      let text='';
       
       const title=$selected1.text();
     await  $selected2.each(function(e){
          text+=" "+$(this).text();
       })
      info.push({
              img,
              title,
            text
              
              
      })
   
          
  
    await res.json(info)
  }catch(err){
      res.json(err)
      console.log(err)
  }
  
})
app.listen(PORT,()=>console.log(`${PORT}`))