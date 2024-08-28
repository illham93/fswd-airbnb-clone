module Api
  class BookingsController < ApplicationController

    before_action :authenticate_api_user, only: [:index]
    def index
      @bookings = current_user.bookings.includes(:property)
      render json: @bookings.as_json(
        include: {
          property: {
            only: [
              :id,
              :title,
              :city,
              :country,
              :price_per_night
            ]
          }
        }
      )
    end
    
    def create
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized if !session

      property = Property.find_by(id: params[:booking][:property_id])
      return render json: { error: 'cannot find property' }, status: :not_found if !property

      begin
        @booking = Booking.create({ 
          user_id: session.user.id,
          property_id: property.id,
          start_date: params[:booking][:start_date],
          end_date: params[:booking][:end_date]
        })
        render 'api/bookings/create', status: :created
      rescue ArgumentError => e
        render json: {error: e.message}, status: :bad_request
      end
    end

    def get_property_bookings
      property = Property.find_by(id: params[:id])
      return render json: {error: 'cannot find property'}, status: :not_found if !property

      @bookings = property.bookings.where('end_date > ?', Date.today)
      render 'api/bookings/index'
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

    def booking_params
      params.require(:bookoing).permit(:property_id, :start_date, :end_date)
    end
  end
end