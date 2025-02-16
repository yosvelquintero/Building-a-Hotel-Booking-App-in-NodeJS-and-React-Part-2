import axios from 'axios'

const { CancelToken } = axios
const search = (input) => {
  if (input) {
    try {
      const source = CancelToken.source()
      const request = axios.get(`/api/search?keyword=${input}`, {
        cancelToken: source.token,
      })
      return {
        async process(callback) {
          request.then((response) => {
            const json = response.data

            if (json && json.data) {
              callback(
                json.data.map(({ address }) => {
                  return {
                    city: address.cityName,
                    code: address.cityCode,
                    country: address.countryName,
                    state: address.stateCode,
                  }
                })
              )
            }
          })
        },
        cancel() {
          source.cancel()
        },
      }
    } catch (error) {
      console.error(error)
    }
  }
  return {
    process() {
      return []
    },
    cancel() {},
  }
}
const getHotels = async (cityCode, checkInDate, checkOutDate) => {
  try {
    const response = await axios.get(
      `/api/hotels?cityCode=${cityCode}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
    )
    const json = response.data

    if (json && json.data) {
      return json.data.map(({ hotel }) => hotel)
    }
  } catch (error) {
    console.error(error)
  }
  return []
}
const getOffers = async (hotelId) => {
  try {
    const response = await axios.get(`/api/offers?hotelId=${hotelId}`)
    const json = response.data

    if (json && json.data) {
      return json.data.offers
    }
  } catch (error) {
    console.error(error)
  }
  return []
}
const confirmOffer = async (offerId) => {
  try {
    const response = await axios.get(`/api/offer?offerId=${offerId}`)
    const json = response.data

    if (json && json.data) {
      return json.data
    }
  } catch (error) {
    console.error(error)
  }
  return null
}
const makeBooking = async (offerId) => {
  const testData = {
    guests: [
      {
        name: {
          title: 'MR',
          firstName: 'BOB',
          lastName: 'SMITH',
        },
        contact: {
          phone: '+33679278416',
          email: 'bob.smith@email.com',
        },
      },
    ],
    payments: [
      {
        method: 'creditCard',
        card: {
          vendorCode: 'VI',
          cardNumber: '4111111111111111',
          expiryDate: '2023-01',
        },
      },
    ],
  }

  try {
    const response = await axios.post(`/api/booking?offerId=${offerId}`, testData)
    const json = response.data

    if (json && json.data) {
      return json.data
    }
  } catch (error) {
    console.error(error)
  }
  return null
}

export { search, getHotels, getOffers, confirmOffer, makeBooking }
