import { supabase } from '../supabaseClient';

// Types for candidate data
export interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  cv_file_id?: string;
  cv_text?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CandidateCreate {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  cv_file_id?: string;
  cv_text?: string;
}

export interface CandidateUpdate {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  cv_file_id?: string;
  cv_text?: string;
}

// Create candidate
export async function createCandidate(data: CandidateCreate) {
  const { data: candidate, error } = await supabase
    .from('candidates')
    .insert([data])
    .select()
    .single();
  if (error) throw error;
  return candidate;
}

// Get all candidates (with pagination)
export async function getCandidates({ skip = 0, limit = 10 } = {}) {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .range(skip, skip + limit - 1)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Get candidate by ID
export async function getCandidate(id: number) {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Update candidate
export async function updateCandidate(id: number, updates: CandidateUpdate) {
  const { data, error } = await supabase
    .from('candidates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete candidate
export async function deleteCandidate(id: number) {
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
