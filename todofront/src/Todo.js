import { useState, useEffect, useCallback } from "react";

export default function Todo(){
    const[title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const[todos,setTodos]=useState([])
    const[error,setError]=useState("")
    const[message,setMessage]=useState("")
    const[editId,setEditId]=useState(-1)
     const[editTitle,setEditTitle]=useState("");
    const[editDescription,setEditDescription]=useState("");
    const apiUrl=process.env.REACT_APP_API_URL;


 
    const handleSubmit=()=>{
        setError("");
        //check input
        if(title.trim()!== '' && description.trim()!==''){
            //add items to list
            fetch(apiUrl+"/todos",{
                method:"POST",
                headers:{
                    'content-Type':'application/json'
                },
                body: JSON.stringify({title,description})
            }).then((res)=>{
                if(res.ok){
                    res.json().then((newTodo) => {
                    setTodos([...todos, newTodo]); 
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully");
                    setTimeout(()=>{
                        setMessage("");

                    },3000)
                });
                }else{
                    setError("Unable to create Todo item")
                }
            }).catch(()=>{
                setError("Unable to create Todo item")
            })
        }
    }
    const getItems = useCallback(() => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  }, [apiUrl]);

  useEffect(() => {
    getItems();
  }, [getItems]);
    const handleEdit=(item)=>{
        setEditId(item._id); 
        setEditTitle(item.title);
        setEditDescription(item.description)
    }
    const handleUpdate= (editId)=>{
        setError("");
        //check input
        if(editTitle.trim()!== '' && editDescription.trim()!==''){
            //add items to list
            fetch(apiUrl+"/todos/"+editId,{
                method:"PUT",
                headers:{
                    'content-Type':'application/json'
                },
                body: JSON.stringify({title :editTitle,description :editDescription})
            }).then((res)=>{
                if(res.ok){
                    //update item to list
                    const updatedTodos=todos.map((item)=>{
                        if(item._id===editId){
                            item.title=editTitle;
                            item.description=editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos)
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated successfully")
                    setTimeout(()=>{
                        setMessage("");

                    },3000)
                    setEditId(-1);
                }else{
                    setError("Unable to create Todo item")
                }
            }).catch(()=>{
                setError("Unable to create Todo item")
            })
        }

    }
    const handleEditCancle=()=>{
        setEditId(-1);
    }
    const handleDelete=(id)=>{
        if(window.confirm('Are you sure you want to delete?')){
            fetch(apiUrl+'/todos/'+id,{
                method:"DELETE"

            })
            .then(()=>{
                const updatedTodos=todos.filter((item)=>item._id!==id)
                setTodos(updatedTodos)
            })
        }
    }
    return <>
    <div className="row p-3 m-3 bg-success text-light">
        <h1>ToDo Project with MERN stack</h1>
    </div>
    <div className="row m-3">
        <h3>Add Item</h3>
        {message &&<p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
        <input placeholder="Title" onChange={(e)=>setTitle(e.target.value)} value={title} className="form-control" type="text"/>
        <input placeholder="Description" onChange={(e)=>setDescription(e.target.value)} value={description} className="form-control" type="text"/>
        <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        {error && <p className="text-danger">{error}</p>}
        </div>
        <div className="row mt-3">
            <h3>Tasks</h3>
            <div className="col-md-6">
                <ul className="list-group">
                    {
                        todos.map((item)=><li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                        <div className="d-flex flex-column me-2">
                            {
                                editId === -1 || editId !== item._id ? <>
                                <span className="fw-bold d-flex">{item.title}</span>
                                <span className="d-flex">{item.description}</span>
                                </> :<>
                                    <div className="form-group d-flex gap-2">
                                        <input placeholder="Title" onChange={(e)=>setEditTitle(e.target.value)} value={editTitle} className="form-control " type="text"/>
                                        <input placeholder="Description" onChange={(e)=>setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text"/>
                                    </div>
                                    </>
                            }

                        </div>
                        <div className="d-flex gap-2">
                        { editId ===-1 ?<button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button> : <button className="btn btn-warning"onClick={()=>handleUpdate(item._id)}>Update</button>}                    
                        { editId ===-1 ? <button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button> :
                        <button className="btn btn-danger" onClick={handleEditCancle}>Cancle</button>}
                        </div>
                    </li>)
                    }
                    
                </ul>
            </div>
        </div>
    </div>

    </>
}