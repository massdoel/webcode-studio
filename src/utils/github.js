import axios from 'axios'

const gh = (token) =>
  axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })

export const getUser = (token) =>
  gh(token).get('/user').then(r => r.data)

export const getUserRepos = (token) =>
  gh(token).get('/user/repos?sort=updated&per_page=50').then(r => r.data)

export const getRepoContents = (token, owner, repo, path = '') =>
  gh(token).get(`/repos/${owner}/${repo}/contents/${path}`).then(r => r.data)

export const getFileContent = async (token, owner, repo, path) => {
  const res = await gh(token).get(`/repos/${owner}/${repo}/contents/${path}`)
  const content = atob(res.data.content.replace(/\n/g, ''))
  return { content, sha: res.data.sha }
}

export const updateFile = (token, owner, repo, path, content, sha, message = 'Update via WebCode Studio') =>
  gh(token).put(`/repos/${owner}/${repo}/contents/${path}`, {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    sha,
  }).then(r => r.data)

export const createFile = (token, owner, repo, path, content, message = 'Create via WebCode Studio') =>
  gh(token).put(`/repos/${owner}/${repo}/contents/${path}`, {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
  }).then(r => r.data)

export const getLanguageFromPath = (filePath) => {
  const ext = filePath.split('.').pop().toLowerCase()
  const map = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    css: 'css', scss: 'scss', html: 'html', json: 'json',
    md: 'markdown', py: 'python', sh: 'shell', yml: 'yaml', yaml: 'yaml',
  }
  return map[ext] || 'plaintext'
}

export const getFileIcon = (name) => {
  const ext = name.split('.').pop().toLowerCase()
  const icons = {
    jsx: '⚛', tsx: '⚛', js: '📜', ts: '📘', css: '🎨', scss: '🎨',
    html: '🌐', json: '📋', md: '📄', png: '🖼', jpg: '🖼', svg: '🖼',
    env: '🔑', gitignore: '🚫',
  }
  return icons[ext] || '📄'
}
