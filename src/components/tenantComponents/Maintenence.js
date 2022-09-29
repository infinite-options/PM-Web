import React from "react"

export default function Maintenence(props){
    const main = props?.data; //array of objects 
    const noRows = "No data available"
    var counter = 0;
    const [currentImg, setCurrentImg] = React.useState(0);

    //implement date.now and calculate amount of days
    const rows = main?.map((row,index)=>{//row is an element in the array 
        if(row.title != null){
            const numDays = (date_1, date_2) => {
                let difference = date_2.getTime() - date_1.getTime();
                let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
            
                return totalDays;
              };
              const created_date = new Date(row.request_created_date);
              // console.log(created_date)
              const current = new Date();
            counter+=1;
            const imgUrl = JSON.parse(row.images)

            const nextImg = () => {
                if (currentImg === imgUrl.length - 1) {
                  setCurrentImg(0);
                } else {
                  setCurrentImg(currentImg + 1);
                }
              };
              const previousImg = () => {
                if (currentImg === 0) {
                  setCurrentImg(imgUrl.length - 1);
                } else {
                  setCurrentImg(currentImg - 1);
                }
              };
            if(imgUrl.length > 1){
                
            }
            return(
            
                <tr>
                    <th className="table-col">{counter}</th>
                    <th className="table-col">{props?.address}</th>
                    <th className="table-col">{row.title}</th>
                    <th className="table-col">{row.request_created_date.substring(0,10)}</th>
                    <th className="table-col date-cell">{numDays(created_date, current)}</th>
                    <th className="table-col">{row.priority}</th>
                    <th className="table-col">{row.request_status}</th>
                    <th className="table-col img-cell">
                        {/* {imgUrl.length > currentImg ?
                        <div className = "img-orientation">
                            <div onClick={previousImg} className="arrow">
                                    {"<"}
                            </div>
                            <img src = {imgUrl[currentImg]} className="table-img multi-img-cell"></img>

                            <div onClick={nextImg} className="arrow">
                                {">"}
                            </div>    
                        </div>
                        :
                        
                        <div className = "img-orientation">
                            <img src = {imgUrl[0]} className="table-img"></img>

                        </div>
                        } */}
                        {imgUrl.length > 1?
                            <div className = "img-orientation">
                                <div onClick={previousImg} className="left-arrow">
                                        {"<"}
                                </div>
                                <img src = {imgUrl.length>currentImg? imgUrl[currentImg]: imgUrl[0]} className="table-img multi-img-cell rel"></img>

                                <div onClick={nextImg} className="right-arrow">
                                    {">"}
                                </div>    
                            </div>
                            :
                            <div className="img-orientation">
                                <img src = {imgUrl[0]} className="table-img multi-img-cell"></img>

                            </div>

                        }
                        

                    </th>
                </tr>
            )
           
        }
        
    })
    return(
        <div className= "maintenence">
            Maintenence
            <table className="table-upcoming-payments">
            <thead>
                <tr className="table-row blue-text">
                    <th className="table-col">ID</th>
                    <th className="table-col">Address</th>
                    <th className="table-col">Issue</th>
                    <th className="table-col">Date Reported</th>
                    <th className="table-col">Days Open</th>
                    <th className="table-col">Type</th>
                    <th className="table-col">Status</th>
                    <th className="table-col">Upload Images</th>
            
                </tr>
            </thead>
            <tbody>
                {/* {main === '' && <tr className="table-row no-data">{noRows}</tr>} */}
                {/* {main?rows:<tr className="table-row no-data">{noRows} */}
                {rows}
            </tbody>

            </table>
        </div>
    )
}