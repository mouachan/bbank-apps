package org.redhat.bbank.model;

public class Loan {

    private String siren;
    private double ca;
    private double nbEmployees;
    private int age;
    private boolean publicSupport;
    private String typeProjet;
    private double amount;
    private Notation notation;
    private boolean eligible = false;
    private String msg;
    private Bilan bilan;
    private double rate;
    private int nbmonths;
	public Loan() {
	}
    

	public Loan(String siren, double ca, double nbEmployees, int age, boolean publicSupport, String typeProjet,
    double amount, Notation notation, boolean eligible, String msg, Bilan bilan, double rate, int nbmonths ) {
        this.siren = siren;
        this.ca = ca;
        this.nbEmployees = nbEmployees;
        this.age = age;
        this.publicSupport = publicSupport;
        this.typeProjet = typeProjet;
        this.amount = amount;
        this.notation = notation;
        this.eligible = eligible;
        this.msg = msg;
        this.bilan = bilan;
        this.rate = rate;
        this.nbmonths = nbmonths;
    }


    /**
     * @return String return the siren
     */
    public String getSiren() {
        return siren;
    }

    /**
     * @param siren the siren to set
     */
    public void setSiren(String siren) {
        this.siren = siren;
    }

    /**
     * @return double return the ca
     */
    public double getCa() {
        return ca;
    }

    /**
     * @param ca the ca to set
     */
    public void setCa(double ca) {
        this.ca = ca;
    }

    /**
     * @return double return the nbEmployees
     */
    public double getNbEmployees() {
        return nbEmployees;
    }

    /**
     * @param nbEmployees the nbEmployees to set
     */
    public void setNbEmployees(double nbEmployees) {
        this.nbEmployees = nbEmployees;
    }

    /**
     * @return int return the age
     */
    public int getAge() {
        return age;
    }

    /**
     * @param age the age to set
     */
    public void setAge(int age) {
        this.age = age;
    }

    /**
     * @return boolean return the publicSupport
     */
    public boolean isPublicSupport() {
        return publicSupport;
    }

    /**
     * @param publicSupport the publicSupport to set
     */
    public void setPublicSupport(boolean publicSupport) {
        this.publicSupport = publicSupport;
    }

    /**
     * @return String return the typeProjet
     */
    public String getTypeProjet() {
        return typeProjet;
    }

    /**
     * @param typeProjet the typeProjet to set
     */
    public void setTypeProjet(String typeProjet) {
        this.typeProjet = typeProjet;
    }

    /**
     * @return double return the amount
     */
    public double getAmount() {
        return amount;
    }

    /**
     * @param amount the amount to set
     */
    public void setAmount(double amount) {
        this.amount = amount;
    }

    /**
     * @return Notation return the notation
     */
    public Notation getNotation() {
        return notation;
    }

    /**
     * @param notation the notation to set
     */
    public void setNotation(Notation notation) {
        this.notation = notation;
    }


	

    /**
     * @return boolean return the eligible
     */
    public boolean isEligible() {
        return eligible;
    }

    /**
     * @param elligible the eligible to set
     */
    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    /**
     * @return String return the msg
     */
    public String getMsg() {
        return msg;
    }

    /**
     * @param msg the msg to set
     */
    public void setMsg(String msg) {
        this.msg = msg;
    }


    /**
     * @return Bilan return the bilan
     */
    public Bilan getBilan() {
        return bilan;
    }

    /**
     * @param bilan the bilan to set
     */
    public void setBilan(Bilan bilan) {
        this.bilan = bilan;
    }
    /**
     * @return double return the rate
     */
    public double getRate() {
        return rate;
    }

    /**
     * @param rate the rate to set
     */
    public void setRate(double rate) {
        this.rate = rate;
    }

    /**
     * @return int return the nbmonths
     */
    public int getNbmonths() {
        return nbmonths;
    }

    /**
     * @param nbmonths the nbmonths to set
     */
    public void setNbmonths(int nbmonths) {
        this.nbmonths = nbmonths;
    }
    @Override
	public String toString() {
		return "Loan [age=" + age + ", amount=" + amount + ", bilan=" + bilan + ", ca=" + ca + ", elligible="
				+ eligible + ", msg=" + msg + ", nbEmployees=" + nbEmployees + ", notation=" + notation
				+ ", publicSupport=" + publicSupport + ", siren=" + siren + ", typeProjet=" + typeProjet + ", rate=" + rate + ", nbmonths="+ nbmonths + "]";
	}

}