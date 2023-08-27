import React, { useState, useEffect, useContext } from 'react';
const axios = require('axios');
import { GlobalSate } from './_app';
import { useRouter } from 'next/router';
import Alert from './Alert';

export default function Add() {
    const { selectedData, setSelectedData } = useContext(GlobalSate)
    const router = useRouter()

    const [name, setName] = useState(selectedData.name || '')
    const [sending, setSending] = useState(false)
    const [price, setPrice] = useState(selectedData.price || '')
    const [desc, setDesc] = useState(selectedData.desc || '')
    const [msg, setMsg] = useState({ status: false, msg: '' })

    const addData = async (e) => {
        e.preventDefault()
        setSending(true)

        const obj = {
            name, price, desc
        }
        try {
            const { data } = await axios.post('/add', obj)
            setMsg({ status: true, msg: data.msg })

            // clear form fields
            setName("")
            setDesc("")
            setPrice("")
            setSending(false)
        }
        catch (err) {
            setSending(false)
            if (err.response) {
                setMsg({ status: false, msg: err.response.data.msg })
            }
            else {
                setMsg({ status: false, msg: err.message })
            }

        }
    }

    const updateData = async (e) => {
        e.preventDefault()
        setSending(true)

        const obj = {
            name, price, desc
        }
        try {
            const { data } = await axios.put(`/${selectedData._id}`, obj)
            setMsg({ status: true, msg: data.msg })

            // push back to the selected data
            router.push(`/product/${data.data._id}`);
            setSelectedData('')

            // clear form fields
            setName("")
            setDesc("")
            setPrice("")
            setSending(false)
        }
        catch (err) {
            setSending(false)
            if (err.response) {
                setMsg({ status: false, msg: err.response.data.msg })
            }
            else {
                setMsg({ status: false, msg: err.message })
            }

        }
    }

    return (
        <div>
            <div onClick={() => { router.push('/') }} style={{ position: 'fixed', top: '50%', background: 'green', transform: 'translateY(-50%)', color: '#fff', height: '30px', borderRadius: '10px', marginLeft: '2px', cursor: 'pointer', padding: '3px 10px', fontSize: '.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>View</div>

            <div style={{ height: '100vh', display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                <form onSubmit={selectedData ? updateData : addData} style={{ background: '#fff', width: '250px', boxShadow: '2px 2px 5px rgba(0,0,0,.1), -2px -2px 5px rgba(0,0,0,.1)', borderRadius: '5px', display: 'flex', flexDirection: 'column', padding: '10px', alignItems: 'center' }}>
                    <h3 style={{ color: '#1877f2', marginBottom: '10px' }}>{selectedData ? 'Update Product' : 'Add Product'}</h3>
                    <div className="form-wrapper">
                        {
                            msg.msg ?
                                // print the msg
                                msg.status ?
                                    // successful msg
                                    <Alert color="#16b216" border="#16b216" bg='#00800029' msg={msg.msg} /> :

                                    // error msg
                                    <Alert color="#e11010" border="#e11010" bg='#f5020221' msg={msg.msg} />
                                : ''
                        }

                        <label htmlFor="">Product Name</label>
                        <input
                            type='text'
                            className="input"
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />


                    </div>
                    <div className="form-wrapper">
                        <label htmlFor="">Product Price:</label>
                        <input
                            min={0}
                            type='number'
                            className="input"
                            placeholder="Enter product price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="form-wrapper">
                        <label htmlFor="">Product Description:</label>
                        <input
                            className="input"
                            placeholder="Enter Product Description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>

                    <input disabled={sending} type="submit" value={sending ? 'Loading...' : selectedData ? 'Update Product' : 'Add Product'} className="input submit" />
                </form>
            </div>
        </div >
    )
}
