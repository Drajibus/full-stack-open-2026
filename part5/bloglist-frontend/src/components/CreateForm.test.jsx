import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'

test('<CreateForm /> updates parent state and calls onSubmit', async () => {
  const createHandler = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<CreateForm createBlog={createHandler} />)

  const inputTitle = container.querySelector('#title')
  const inputAuthor = container.querySelector('#author')
  const inputUrl = container.querySelector('#url')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'Testing form')
  await user.type(inputAuthor, 'dev')
  await user.type(inputUrl, 'http://url_fake_for_test.com')

  await user.click(sendButton)

  expect(createHandler.mock.calls).toHaveLength(1)
  expect(createHandler.mock.calls[0][0].title).toBe('Testing form')
})
