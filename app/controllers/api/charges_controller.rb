module Api
  class ChargesController < ApplicationController

    skip_before_action :verify_authenticity_token, only: [:mark_complete]

    def create
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized if !session
    
      property = Property.find_by(id: params[:property_id])
      return render json: { error: 'cannot find property' }, status: :not_found if !property

      amount = params[:amount].to_i
      property_id = params[:property_id]
      start_date = params[:start_date]
      end_date = params[:end_date]
    
      # Create the Stripe session
      stripe_session = Stripe::Checkout::Session.create(
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            unit_amount: amount, # amount in cents
            product_data: {
              name: "Trip for #{property.title}",
            }
          },
          # quantity: (Date.parse(params[:end_date]) - Date.parse(params[:start_date])).to_i,
          quantity: 1
        }],
        mode: 'payment',
        success_url: "#{request.base_url}/booking_confirmation/#{property.id}?property_id=#{property.id}&start_date=#{params[:start_date]}&end_date=#{params[:end_date]}&session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "#{ENV['URL']}#{params[:cancel_url]}"
      )
    
      # Create a new charge in the database
      @charge = Charge.new({
        checkout_session_id: stripe_session.id,
        currency: 'usd',
        amount: amount,
        property_id: property_id,
        start_date: start_date,
        end_date: end_date
      })
      
      if @charge.save
        render 'api/charges/create', status: :created
      else
        render json: { error: 'charge could not be created' }, status: :bad_request
      end

      # Return the Stripe session id for redirecting to checkout
      # render json: { charge: { checkout_session_id: stripe_session.id } }
    end
    

    def mark_complete
      # You can find your endpoint's secret in your webhook settings
      endpoint_secret = ENV['STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET']

      event = nil

      # Verify webhook signature and extract the event
      # See https://stripe.com/docs/webhooks/signatures for more information
      begin
        sig_header = request.env['HTTP_STRIPE_SIGNATURE']
        payload = request.body.read
        event = Stripe::Webhook.construct_event(
          payload, sig_header, endpoint_secret
        )
      rescue JSON::ParserError => e
        # Invalid payload
        return head :bad_request
      rescue Stripe::SignatureVerificationError => e
        # Invalid signature
        return head :bad_request
      end

      # Handle the checkout.session.completed event
      if event['type'] == 'checkout.session.completed'
        session = event['data']['object']

        # Fulfuill the purchase, mark related charge as complete
        charge = Charge.find_by(checkout_session_id: session.id)
        return head :bad_request if !charge

        charge.update({ complete: true })

        return head :ok
      end

      return head :bad_request
    end
  end
end