class StaticPagesController < ApplicationController
  before_action :authenticate_api_user, only: [:user_properties, :edit_property, :add_property, :trips]
  def home
    render 'home'
  end

  def property
    @data = { property_id: params[:id] }.to_json
    render 'property'
  end

  def login
    render 'login'
  end

  def user_properties
    if @authenticated
      @properties = current_user.properties
      render 'home'
    else
      redirect_to login_path, alert: 'You need to log in to view your properties.'
    end
  end

  def edit_property
    @property = Property.find(params[:id])

    unless @property.user == current_user
      redirect_to root_path, alert: 'You are not authorized to edit this property.' and return
    end

    @data = { property_id: params[:id] }.to_json
    render 'edit_property'
  end

  def add_property
    if @authenticated
      render 'add_property'
    else
      redirect_to login_path, alert: 'You need to log in to add a property.'
    end
  end

  def trips
    if @authenticated
      render 'trips'
    else
      redirect_to login_path, alert: 'You need to log in to view your trips.'
    end
  end

  def booking_confirmation
      property_id = params[:id]
      if property_id.present?
        @data = { property_id: params[:id] }.to_json
      else
        @data = {}.to_json
      end
      render 'booking_confirmation'
  end

  private

  def authenticate_api_user
    token = cookies.signed[:airbnb_session_token]
    session = Session.find_by(token: token)

    if session
      @user = session.user
      @authenticated = true
    else
      @authenticated = false
    end
  end

  def current_user
    @user
  end
end
