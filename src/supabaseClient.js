import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cqlotkeqkxaihyvfktfe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxbG90a2Vxa3hhaWh5dmZrdGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTY1ODksImV4cCI6MjA4ODk3MjU4OX0.cRGAor4Vch0KZcXKZ46i50hnHDk7GGitdidICmco8tg'

export const supabase = createClient(supabaseUrl, supabaseKey)