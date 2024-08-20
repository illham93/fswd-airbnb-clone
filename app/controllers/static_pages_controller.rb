class StaticPagesController < ApplicationController
  before_action :authenticate_api_user, only: [:user_properties]
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
