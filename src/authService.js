import { supabase } from './supabaseClient'

export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })
  if (error) return { data, error }

  if (data?.user?.id && fullName) {
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: data.user.id, full_name: fullName },
    ])
    if (profileError) return { data, error: profileError }
  }
  return { data, error }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}


