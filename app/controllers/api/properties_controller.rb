module Api
  class PropertiesController < ApplicationController
    def index
      @properties = Property.order(created_at: :desc).page(params[:page]).per(6)
      return render json: { error: 'not_found' }, status: :not_found if !@properties

      render 'api/properties/index', status: :ok
    end

    def show
      @property = Property.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found if !@property

      render 'api/properties/show', status: :ok
    end

    before_action :authenticate_api_user

    def user_properties
      if @authenticated
        @properties = current_user.properties.order(created_at: :desc).page(params[:page]).per(6)
        render 'api/properties/index', status: :ok
      else
        render json: {error: 'User not authenticated' }, status: :unauthorized
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
end
