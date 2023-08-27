import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router';
import formatter from "@master_teacher/formatamount"
import axios from 'axios'
import { GlobalSate } from '../_app';
import Alert from '../Alert';

export default function id() {
    const router = useRouter()
    const [sending, setSending] = useState(true)
    const [data, setData] = useState('')
    const [msg, setMsg] = useState('')
    const [deleteMsg, setDeleteMsg] = useState({ msg: '', status: false })
    const [loading, setLoading] = useState(false)
    const { id } = router.query
    const { setSelectedData } = useContext(GlobalSate)

    async function getData() {
        try {
            const { data } = await axios.get(`/${id}`)
            setData(data.data)
            setSending(false)
        }
        catch (err) {
            setSending(false)
            if (err.response) {
                setMsg(err.response.data.msg)
            }
            else {
                setMsg(err.message)
            }
        }
    }

    useEffect(() => {
        if (id) {
            getData()
        }
    }, [id])

    const handleEdit = (data) => {
        setSelectedData(data)
        router.push('/add')
    }
    const handleDelete = async (id) => {
        try {
            setLoading(true)
            const result = await axios.delete(`/${id}`)
            setLoading(false)
            setDeleteMsg({ status: true, msg: result.data.msg })
            setTimeout(() => {
                router.push('/')
            }, 3000)
        }
        catch (err) {
            setLoading(false);
            if (err.response) {
                setDeleteMsg({ status: false, msg: err.response.data.msg })
            }
            else {
                setDeleteMsg({ status: false, msg: err.message })
            }
        }
    }

    return (
        <div>
            <span onClick={() => router.back()} style={{ border: '1px solid #aaa', padding: '1px 10px', textAlign: 'center', cursor: 'pointer', margin: '3px', borderRadius: '10px', display: 'inline-block', }}>&larr;</span>
            {
                sending ? 'Loading...' :
                    <div>
                        {
                            msg ? <div>{msg}</div> :

                                <div style={{ maxWidth: '500px', width: '90vw', background: '#fff', padding: '10px', margin: 'auto', position: 'relative' }}>
                                    <div style={{ position: 'absolute', right: 0, top: '-3.5px' }}>
                                        <span onClick={() => handleEdit(data)} style={{ padding: '2px 4px', fontSize: '.6rem', cursor: 'pointer', background: 'green', color: '#fff', marginRight: '3px' }}>Edit</span>
                                        <span onClick={loading ? () => { } : () => handleDelete(data._id)} style={{ padding: '2px 4px', fontSize: '.6rem', cursor: 'pointer', background: 'red', color: '#fff' }}>{loading ? "Loading" : 'Delete'}</span>
                                    </div>

                                    {
                                        deleteMsg.msg ?
                                            deleteMsg.status ?
                                                <div style={{ width: '85%' }}>
                                                    <Alert color="#16b216" border="#16b216" bg='#00800029' msg={deleteMsg.msg} />
                                                </div> :
                                                <div style={{ width: '85%' }}>
                                                    <Alert color="#e11010" border="#e11010" bg='#f5020221' msg={deleteMsg.msg} />
                                                </div>
                                            : ''
                                    }

                                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', color: 'teal' }}>{data.name}</div>

                                    <div className='price'>{data.currency}{" "}{formatter(`${data.price.toString()}.00`)}</div>
                                    <div className='desc'>{data.desc}</div>

                                </div>
                        }
                    </div>
            }
        </div>
    )
}
