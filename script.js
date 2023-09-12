document.addEventListener('DOMContentLoaded', () => {
  const main_wrapper = document.querySelector('.main-wrapper')

  const createNode = (node) => document.createElement(node)
  const getNode = (node) => document.querySelector(node)

  const imageCreator = (image, index) => {
    const img = createNode('img')
    img.setAttribute('id', `img_${index}`)
    img.src = image.src
    img.alt = image.alt
    return img
  }

  const captionCreator = (text) => {
    const span = createNode('span')
    span.setAttribute('class', 'caption')
    span.textContent = text
    return span
  }

  const buttonCreator = (id, text) => {
    const btn = createNode('button')
    btn.setAttribute('class', 'btn')
    btn.setAttribute('id', id)
    btn.setAttribute('type', 'button')
    btn.textContent = text

    return btn
  }

  const addSlideForm = () => {
    const form = createNode('form')
    form.setAttribute('class', 'form')

    const caption_label = createNode('label')
    caption_label.setAttribute('class', 'form-label')
    caption_label.setAttribute('for', 'input_caption')
    caption_label.textContent = 'Caption'

    const caption_input = createNode('input')
    caption_input.setAttribute('type', 'text')
    caption_input.setAttribute('class', 'form-input')
    caption_input.setAttribute('id', 'input_caption')

    const image_label = createNode('label')
    image_label.setAttribute('class', 'form-label')
    image_label.setAttribute('for', 'input_img')
    image_label.textContent = 'Select Image'

    const image_input = createNode('input')
    image_input.setAttribute('type', 'file')
    image_input.setAttribute('id', 'input_img')
    image_input.setAttribute('accept', 'image/*')

    const add_button = buttonCreator('add_slide_btn', 'Add Slide')

    const line_breaker = createNode('br')

    const fragment = document.createDocumentFragment()
    fragment.appendChild(caption_label)
    fragment.appendChild(caption_input)
    fragment.appendChild(line_breaker)
    fragment.appendChild(image_label)
    fragment.appendChild(image_input)
    fragment.appendChild(line_breaker)
    fragment.appendChild(add_button)

    form.appendChild(fragment)
    return form
  }

  const createSliderForm = () => {
    const building_wrapper = createNode('div')
    building_wrapper.setAttribute('class', 'building-wrapper')
    const alertBox = createNode('div')
    alertBox.setAttribute('id', 'alertBox')
    const Note = createNode('span')
    Note.textContent = '4 : 3 Ratio Images Are Suitable'
    const image_box = createNode('div')
    image_box.setAttribute('class', 'image-box')
    image_box.setAttribute('id', 'img_box')
    alertBox.appendChild(Note)
    building_wrapper.appendChild(image_box)
    building_wrapper.appendChild(alertBox)
    building_wrapper.appendChild(addSlideForm())
    return building_wrapper
  }

  const slideCreator = (image, index) => {
    const slide = createNode('div')
    slide.setAttribute('class', 'slide')
    slide.setAttribute('id', `slide-${index}`)
    slide.appendChild(imageCreator(image, index))
    slide.appendChild(captionCreator(image.alt, index))
    return slide
  }

  const slideControllersController = () => {
    const btn_container = createNode('div')
    btn_container.setAttribute('class', 'slider-btns')
    btn_container.appendChild(buttonCreator('prev', 'Prev'))
    btn_container.appendChild(buttonCreator('playPause', 'Play Pause'))
    btn_container.appendChild(buttonCreator('next', 'Next'))
    return btn_container
  }

  const createSlideContainer = () => {
    const slider_container = createNode('div')
    slider_container.setAttribute('class', 'slider-container')

    const slides = createNode('div')
    slides.setAttribute('class', 'slides')
    images.map((image, index) => {
      slides.appendChild(slideCreator(image, index))
    })
    slider_container.appendChild(slides)
    slider_container.appendChild(slideControllersController())
    return slider_container
  }

  const removeSlide = (index) => {
    getNode(`#slide-${index}`).style.display = 'none'
  }
  const setSlide = (index) => {
    getNode(`#slide-${index}`).style.display = 'block'
  }

  const nextSlide = () => {
    removeSlide(currentSlide)
    if (currentSlide === images.length - 1) currentSlide = -1
    currentSlide += 1
    setSlide(currentSlide)
    return
  }
  const prevSlide = () => {
    removeSlide(currentSlide)
    if (currentSlide === 0) currentSlide = images.length
    currentSlide -= 1
    setSlide(currentSlide)
  }
  const autoPlay = () => {
    intervalFrame = setInterval(() => {
      nextSlide(currentSlide)
    }, 3000)
  }

  const images = []
  let currentSlide = 0
  let playing = true
  let intervalFrame

  // DOMM_________________________starts here

  const start_creation = getNode('#start_creation')
  // it all starts here _________________
  start_creation.addEventListener('click', () => {
    const introWrapper = getNode('.intro-wrapper')
    introWrapper.remove()
    main_wrapper.appendChild(createSliderForm(images))
  })

  // after intro ___________________________
  main_wrapper.addEventListener('click', (e) => {
    if (e.target.id === 'add_slide_btn') {
      if (images.length === 5) return
      const caption = getNode('#input_caption').value
      const inputFile = getNode('#input_img')

      if (!inputFile.files || inputFile.files.length === 0 || !caption) return

      const src = URL.createObjectURL(inputFile.files[0])
      images.push({ src, alt: caption })

      const image_box = getNode('#img_box')
      image_box.appendChild(imageCreator(images[images.length - 1]))
      if (images.length > 2) {
        if (getNode('#start_slide_btn')) return
        const start_slide_btn = buttonCreator('start_slide_btn', 'Create')
        getNode('.form').appendChild(start_slide_btn)
      }
      alertBox.textContent = `${images.length} Slides Added`
      getNode('.form').reset()
    }
    if (e.target.id === 'start_slide_btn') {
      getNode('.building-wrapper').remove()
      main_wrapper.appendChild(createSlideContainer())
      setSlide(currentSlide)
      autoPlay()
    }
    if (e.target.id === 'prev') {
      prevSlide(currentSlide)
    }
    if (e.target.id === 'next') {
      nextSlide(currentSlide)
    }
    if (e.target.id === 'playPause') {
      if (playing) {
        getNode('#playPause').classList.remove('playing')
        getNode('#playPause').classList.add('notPlaying')
        getNode('#playPause').textContent = 'Play'
        clearInterval(intervalFrame)
        playing = false
        return
      }
      autoPlay()
      getNode('#playPause').classList.add('playing')
      getNode('#playPause').classList.remove('notPlaying')
      getNode('#playPause').textContent = 'Pause'
      playing = true
      return
    }
    return
  })
})

