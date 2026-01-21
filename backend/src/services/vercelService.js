// services/vercelService.js
// Correct Vercel deployment implementation (NO base64 encoding)

export async function deployToVercel(
  vercelToken,
  projectName,
  files,
  options = {}
) {
  // Ensure project exists
  await createOrUpdateProject(vercelToken, projectName)

  // Convert generated files into Vercel-compatible format
  const fileList = Object.entries(files).map(([path, content]) => {
    const rawContent =
      typeof content === 'string'
        ? content
        : JSON.stringify(content, null, 2)

    return {
      file: path,
      data: rawContent // ✅ MUST be plain UTF-8 text
    }
  })

  const payload = {
    name: projectName,
    files: fileList,
    projectSettings: {
      framework: 'vite',
      installCommand: 'npm install',
      buildCommand: 'npm run build',
      outputDirectory: 'dist'
    },
    target: options.production ? 'production' : undefined
  }

  const response = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const text = await response.text()

  if (!response.ok) {
    let message = text
    try {
      const json = JSON.parse(text)
      message = json.error?.message || json.message || text
    } catch {}
    throw new Error(message)
  }

  const data = JSON.parse(text)

  return {
    id: data.id,
    url: `https://${data.url || `${projectName}.vercel.app`}`,
    status: data.readyState || 'QUEUED',
    inspectorUrl: data.inspectorUrl
  }
}

// ---------------------------------------------
// Project management
// ---------------------------------------------

async function createOrUpdateProject(vercelToken, projectName) {
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${projectName}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicSource: true })
    }
  )

  // Create project if it does not exist
  if (res.status === 404) {
    await fetch('https://api.vercel.com/v9/projects', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectName,
        framework: 'vite',
        publicSource: true
      })
    })
  }
}

// ---------------------------------------------
// Deployment status
// ---------------------------------------------

export async function getDeploymentStatus(vercelToken, deploymentId) {
  const res = await fetch(
    `https://api.vercel.com/v13/deployments/${deploymentId}`,
    {
      headers: {
        Authorization: `Bearer ${vercelToken}`
      }
    }
  )

  if (!res.ok) return null

  const data = await res.json()

  return {
    id: data.id,
    url: data.url ? `https://${data.url}` : null,
    status: data.readyState,
    ready: data.readyState === 'READY'
  }
}
