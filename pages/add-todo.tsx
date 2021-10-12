import { doc } from '@firebase/firestore';
import { setDoc } from 'firebase/firestore';
import type { NextPage } from 'next'
import Head from "next/head";
import { useState } from 'react';
import { firestore } from '../firebase/clientApp';
import styles from '../styles/Home.module.css'

const AddTodo:NextPage = () => {

    const [title,setTitle] = useState<string>(""); // title
    const [description,setDescription] = useState<string>("");// description
    const [error,setError] = useState<string>("");// error
    const [message,setMessage] = useState<string>("");// message

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // avoid default behaviour
        
        if(!title || !description){ // check for any null value
            return setError("All fields are required");
        }
        addTodo();
    }

    const addTodo = async () => {
        // get the current timestamp
        const timestamp:string = Date.now().toString();
        // create a pointer to our document
        const _todo = doc(firestore,`todos/${timestamp}`);  
        // structure the todo data
        const todoData = {
            title,
            description,
            done:false
        };
        
        try{
            //add the document
            await setDoc(_todo,todoData);
            //show a success message
            setMessage("Todo added successfully");
            //reset fields
            setTitle("");
            setDescription("");
        }catch(error){
            //show an error message
            setError("An error occurred while adding todo");      
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Add todo</title>
                <meta name="description" content="Next.js firebase todos app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main}>

                <h1 className={styles.title}>
                    Add todo
                </h1>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {
                        error ? (
                            <div className={styles.formGroup}>
                                <p className={styles.error}>{error}</p>
                            </div>
                        ) : null
                    }

                    {
                        message ? (
                            <div className={styles.formGroup}>
                                <p className={styles.success}>
                                    {message}. Proceed to <a href="/">Home</a>
                                </p>
                            </div>
                        ) : null
                    }

                    <div className={styles.formGroup}>
                        <label>Title</label>
                        <input type="text" 
                        placeholder="Todo title" 
                        onChange={e => setTitle(e.target.value)}
                        value={title}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea 
                        placeholder="Todo description"  
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <button type="submit">Submit</button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default AddTodo;