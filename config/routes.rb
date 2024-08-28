Rails.application.routes.draw do
  root to: 'static_pages#home'

  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  get '/user_properties' => 'static_pages#user_properties'
  get '/edit_property/:id' => 'static_pages#edit_property'
  get '/add_property' => 'static_pages#add_property'

  namespace :api do
    # Add routes below this line
    resources :users, only: [:create]
    resources :sessions, only: %i[create destroy]
    resources :properties, only: [:index, :show]
    resources :bookings, only: [:create]
    resources :charges, only: [:create]

    delete '/logout' => 'sessions#destroy'
    get '/properties/:id/bookings' => 'bookings#get_property_bookings'
    get '/authenticated' => 'sessions#authenticated'
    get 'user_properties' => 'properties#user_properties'
    delete 'properties/:id' => 'properties#destroy'
    put 'properties/:id' => 'properties#update'
    put 'properties/:id/upload_image' => 'properties#upload_image'
    get 'properties/:id/image' => 'properties#image'
    post 'add_property' => 'properties#create'

    # stripe webhook
    post '/charges/mark_complete' => 'charges#mark_complete'
  end
end
