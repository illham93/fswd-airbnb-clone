class Charge < ApplicationRecord
  has_one :booking

  validates :checkout_session_id, presence: true
  validates :currency, presence: true
  validates :amount, presence: true
  validates :property_id, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true
end