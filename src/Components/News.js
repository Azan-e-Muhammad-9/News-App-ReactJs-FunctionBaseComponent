import React, { useState,useEffect } from 'react';
import propTypes from "prop-types";

import Spinner from "./Spinner";
import Newsitems from "./Newsitems";

import InfiniteScroll from "react-infinite-scroll-component";




const News=(props)=> {


  const [articles, setArticles] = useState([]);
  const [loading, setLoading]= useState(false);
  // eslint-disable-line 
  const [page, setPage]=useState(1);
  const [totalResults, setTotalResults]=useState(0);
   



   const capatilizeTheFirstChar=(str) => {

  return str.charAt(0).toUpperCase() + str.slice(1);
  
}



const newsUpdate= async()=> {
  
  props.setProgress(0);
  let newsApiUrl = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
  
  
  
  setLoading(true);
  let data = await fetch(newsApiUrl);
  let dataInJson = await data.json();
  
  
  setArticles(dataInJson.articles);
  setTotalResults( dataInJson.totalResults);
  setLoading(false);
  
  props.setProgress(100);
}

useEffect(() => {

  document.title=capatilizeTheFirstChar(props.category)+": news.Az"
  newsUpdate();
    // eslint-disable-line 
  
  }, [])

 
  const fetchMoreData = async() => {
   

    
    let newsApiUrl = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    
    setPage(page+1);
    setLoading( true );
    let data = await fetch(newsApiUrl);
    let dataInJson = await data.json();
   
      setArticles(articles.concat(dataInJson.articles));
      setTotalResults( dataInJson.totalResults);
      setLoading(false);


  };


    return (
      <>
          <h1 className="text-center my-3" style={{paddingTop:"60px"}}> {`Latest ${capatilizeTheFirstChar(props.category)} News`}</h1>

          <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}

        >

        <div className="container ">

          <div className="row">
            {
              articles.map((obj) => {
                return (
                  <div className="col-md-4" key={obj.url}>
                    <Newsitems
                      title={obj.title}
                      description={
                        obj.description === null ? " " : obj.description
                      }
                      urlToImage={obj.urlToImage}
                      url={obj.url}
                      author={obj.author}
                      date={obj.publishedAt}
                      source={obj.source.name}
                    />
                  </div>
                );
              })}
          </div>

        </div>
    

          </InfiniteScroll>

      </>
    );
}


News.defaultProps = {
  country: "us",
  pageSize: 6,
  category: "general",
};

News.propTypes = {
  country: propTypes.string.isRequired,
  pageSize: propTypes.number,
  apiKey: propTypes.string.isRequired,
};



export default News;
