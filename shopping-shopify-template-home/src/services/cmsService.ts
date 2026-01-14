import cmsMock from '../mocks/cms.mock.json'

export const getCmsContent = async () => {
  try {
    return cmsMock
  } catch (e) {
    console.error('Error trying get content', e)
  }

  return null
}