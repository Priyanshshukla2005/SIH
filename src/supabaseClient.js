import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hgvwcozayttxfjlpdsne.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhndndjb3pheXR0eGZqbHBkc25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjM5MDEsImV4cCI6MjA3Mzc5OTkwMX0.xytOhG96aSD6KMBMH28U-O1doGhuD6GW_Dqz4BvXo4Y"
export const supabase = createClient(supabaseUrl, supabaseKey)


