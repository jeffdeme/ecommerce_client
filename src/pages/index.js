import React, { useState, useEffect, useContext } from 'react'
import formatter from "@master_teacher/formatamount"
import axios from 'axios'
import { useRouter } from 'next/router';
import filter from '@mozeyinedu/filter'


export default function index() {
  const [msg, setMsg] = useState({ status: false, msg: '' })
  const [sending, setSending] = useState(false)
  const [data, setData] = useState([]);
  const [searchedItem, setSearchedItem] = useState([]);
  const router = useRouter();
  const [inp, setInp] = useState('')

  async function fetchProducts() {
    try {
      setSending(true)

      const { data } = await axios.get('/')
      setData(data.data)

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
  useEffect(() => {
    fetchProducts()
  }, [])

  const selectItem = (id) => {
    router.push(`/product/${id}`)
  }

  useEffect(() => {
    const filterdData = filter({
      data,
      keys: ['name', 'price', 'desc'],
      input: inp
    })

    setSearchedItem(filterdData)
  }, [inp, data])
  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => { router.push('/add') }} style={{ position: 'fixed', top: '50%', background: 'green', transform: 'translateY(-50%)', color: '#fff', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', marginLeft: '2px', cursor: 'pointer' }}>&#43;</div>
      {
        sending ? 'Loading...' :
          data.length ?
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                <div style={{ maxWidth: '300px', width: '90vw' }}>
                  <input
                    type="text"
                    className='input'
                    vale={inp}
                    onChange={(e) => setInp(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', padding: '10px' }}>

                {
                  searchedItem.map((item, i) => {
                    return (
                      <div key={item._id} className='card' onClick={() => selectItem(item._id)}>
                        <div className='name'>{item.name}</div>
                        <div className='price'>{item.currency}{" "}{formatter(`${item.price.toString()}.00`)}</div>
                        <div className='desc'>{item.desc}</div>
                      </div>
                    )
                  })
                }
              </div>
            </div> :
            <div>
              {
                msg.msg ? <div>{msg.msg}</div> :
                  <div>Please no product</div>
              }
            </div>
      }
    </div>
  )
}
