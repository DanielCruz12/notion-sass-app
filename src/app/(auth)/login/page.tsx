'use client'

import { useRouter } from 'next/navigation'
/* import React, { useState } from 'react'
 */
const LoginPage = () => {
  const navigate = useRouter()
/*   const [submitError, setSubmitError] = useState('')
 */
  console.log(navigate)
  return <div>LoginPage</div>
}

export default LoginPage
