using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Greenhouse_farming.Models.Entity;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<actualresourceusage> actualresourceusages { get; set; }

    public virtual DbSet<culture> cultures { get; set; }

    public virtual DbSet<greenhouse> greenhouses { get; set; }

    public virtual DbSet<optimalcondition> optimalconditions { get; set; }

    public virtual DbSet<person> people { get; set; }

    public virtual DbSet<resourcetype> resourcetypes { get; set; }

    public virtual DbSet<resourceusage> resourceusages { get; set; }

    public virtual DbSet<sensordata_aggregate> sensordata_aggregates { get; set; }

    public virtual DbSet<sensordatum> sensordata { get; set; }

    public virtual DbSet<typeworking> typeworkings { get; set; }

    public virtual DbSet<unit> units { get; set; }

    public virtual DbSet<userrole> userroles { get; set; }

    public virtual DbSet<working> workings { get; set; }

    public virtual DbSet<Culture_Greenhouse> culture_Greenhouses { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.userid).HasName("User_pkey");

            entity.ToTable("User");

            entity.Property(e => e.login).HasMaxLength(20);

            entity.HasOne(d => d.role).WithMany(p => p.Users)
                .HasForeignKey(d => d.roleid)
                .HasConstraintName("User_roleid_fkey");
        });

        modelBuilder.Entity<actualresourceusage>(entity =>
        {
            entity.HasKey(e => new { e.workingid, e.resourceid }).HasName("actualresourceusage_pkey");

            entity.ToTable("actualresourceusage");

            entity.HasOne(d => d.resource).WithMany(p => p.actualresourceusages)
                .HasForeignKey(d => d.resourceid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("actualresourceusage_resourceid_fkey");

            entity.HasOne(d => d.working).WithMany(p => p.actualresourceusages)
                .HasForeignKey(d => d.workingid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("actualresourceusage_workingid_fkey");
        });

        modelBuilder.Entity<culture>(entity =>
        {
            entity.HasKey(e => e.cultureid).HasName("culture_pkey");

            entity.ToTable("culture");

            entity.Property(e => e.name).HasMaxLength(20);
            entity.Property(e => e.season).HasMaxLength(20);
            entity.Property(e => e.type).HasMaxLength(20);
        });

        modelBuilder.Entity<greenhouse>(entity =>
        {
            entity.HasKey(e => e.greenhousenumber).HasName("greenhouse_pkey");

            entity.ToTable("greenhouse");

            entity.Property(e => e.name).HasMaxLength(20);

            entity.HasMany(d => d.cultures)
        .WithMany(p => p.greenhousenumbers)
        .UsingEntity<Culture_Greenhouse>(
            j => j
                .HasOne(pt => pt.culture)
                .WithMany()
                .HasForeignKey(pt => pt.cultureid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("culture_greenhouse_cultureid_fkey"),
            j => j
                .HasOne(pt => pt.greenhouse)
                .WithMany()
                .HasForeignKey(pt => pt.greenhousenumber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("culture_greenhouse_greenhousenumber_fkey"),
            j =>
            {
                j.HasKey(t => new { t.greenhousenumber, t.cultureid }).HasName("culture_greenhouse_pkey");
                j.ToTable("culture_greenhouse");
            });

        });

        modelBuilder.Entity<optimalcondition>(entity =>
        {
            entity.HasKey(e => e.cultureid).HasName("optimalconditions_pkey");

            entity.Property(e => e.cultureid).ValueGeneratedNever();

            entity.HasOne(d => d.culture).WithOne(p => p.optimalcondition)
                .HasForeignKey<optimalcondition>(d => d.cultureid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("optimalconditions_cultureid_fkey");
        });

        modelBuilder.Entity<person>(entity =>
        {
            entity.HasKey(e => e.personid).HasName("person_pkey");

            entity.ToTable("person");

            entity.HasIndex(e => e.userid, "person_userid_key").IsUnique();

            entity.Property(e => e.email).HasMaxLength(20);
            entity.Property(e => e.firstname).HasMaxLength(20);
            entity.Property(e => e.lastname).HasMaxLength(20);

            entity.HasOne(d => d.user).WithOne(p => p.person)
                .HasForeignKey<person>(d => d.userid)
                .HasConstraintName("person_userid_fkey");
        });

        modelBuilder.Entity<resourcetype>(entity =>
        {
            entity.HasKey(e => e.resourceid).HasName("resourcetype_pkey");

            entity.ToTable("resourcetype");

            entity.Property(e => e.name).HasMaxLength(20);
            entity.Property(e => e.noteone).HasMaxLength(20);
            entity.Property(e => e.notetwo).HasMaxLength(20);

            entity.HasOne(d => d.unit).WithMany(p => p.resourcetypes)
                .HasForeignKey(d => d.unitid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resourcetype_unitid_fkey");
        });

        modelBuilder.Entity<resourceusage>(entity =>
        {
            entity.HasKey(e => new { e.workingid, e.resourceid }).HasName("resourceusage_pkey");

            entity.ToTable("resourceusage");

            entity.HasOne(d => d.resource).WithMany(p => p.resourceusages)
                .HasForeignKey(d => d.resourceid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resourceusage_resourceid_fkey");

            entity.HasOne(d => d.working).WithMany(p => p.resourceusages)
                .HasForeignKey(d => d.workingid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resourceusage_workingid_fkey");
        });

        modelBuilder.Entity<sensordata_aggregate>(entity =>
        {
            entity.HasKey(e => new { e.periodstart, e.periodend, e.greenhousenumber }).HasName("sensordata_aggregate_pkey");

            entity.ToTable("sensordata_aggregate");

            entity.Property(e => e.periodstart).HasColumnType("timestamp without time zone");
            entity.Property(e => e.periodend).HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.greenhousenumberNavigation).WithMany(p => p.sensordata_aggregates)
                .HasForeignKey(d => d.greenhousenumber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sensordata_aggregate_greenhousenumber_fkey");
        });

        modelBuilder.Entity<sensordatum>(entity =>
        {
            entity.HasKey(e => new { e.timestamp, e.greenhousenumber }).HasName("sensordata_pkey");

            entity.Property(e => e.timestamp).HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.greenhousenumberNavigation).WithMany(p => p.sensordata)
                .HasForeignKey(d => d.greenhousenumber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("sensordata_greenhousenumber_fkey");
        });

        modelBuilder.Entity<typeworking>(entity =>
        {
            entity.HasKey(e => e.typeid).HasName("typeworking_pkey");

            entity.ToTable("typeworking");

            entity.Property(e => e.type).HasMaxLength(20);
        });

        modelBuilder.Entity<unit>(entity =>
        {
            entity.HasKey(e => e.unitid).HasName("unit_pkey");

            entity.ToTable("unit");

            entity.Property(e => e.unit1)
                .HasMaxLength(20)
                .HasColumnName("unit");
        });

        modelBuilder.Entity<userrole>(entity =>
        {
            entity.HasKey(e => e.roleid).HasName("userrole_pkey");

            entity.ToTable("userrole");

            entity.Property(e => e.rolename).HasMaxLength(20);
        });

        modelBuilder.Entity<working>(entity =>
        {
            entity.HasKey(e => e.workingid).HasName("working_pkey");

            entity.ToTable("working");

            entity.Property(e => e.actualenddatetime).HasColumnType("timestamp without time zone");
            entity.Property(e => e.actualstartdatetime).HasColumnType("timestamp without time zone");
            entity.Property(e => e.plannedenddatetime).HasColumnType("timestamp without time zone");
            entity.Property(e => e.plannedstartdatetime).HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.greenhousenumberNavigation).WithMany(p => p.workings)
                .HasForeignKey(d => d.greenhousenumber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("working_greenhousenumber_fkey");

            entity.HasOne(d => d.type).WithMany(p => p.workings)
                .HasForeignKey(d => d.typeid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("working_typeid_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
